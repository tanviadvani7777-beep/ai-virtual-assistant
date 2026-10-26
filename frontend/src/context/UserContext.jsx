import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()

function UserContext({ children }) {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"
    const [userData, setUserData] = useState(() => {
        try {
            const saved = localStorage.getItem("demo_user")
            return saved ? JSON.parse(saved) : null
        } catch (_) {
            return null
        }
    })
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
            if (result.data) {
                setUserData(result.data)
                return
            }
        } catch (error) {
            // Local fallback if backend is offline or on static host
            console.log("Backend offline or static mode:", error.message)
        }
    }

    const fallbackResponse = (command) => {
        const lower = (command || "").toLowerCase().trim()
        if (lower.includes("time")) {
            return {
                type: "get-time",
                userInput: command,
                response: "The current time is " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        }
        if (lower.includes("date")) {
            return {
                type: "get-date",
                userInput: command,
                response: "Today's date is " + new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            }
        }
        if (lower.includes("calculator")) {
            return { type: "calculator-open", userInput: command, response: "Opening calculator for you." }
        }
        if (lower.includes("instagram")) {
            return { type: "instagram-open", userInput: command, response: "Opening Instagram." }
        }
        if (lower.includes("facebook")) {
            return { type: "facebook-open", userInput: command, response: "Opening Facebook." }
        }
        if (lower.includes("weather")) {
            return { type: "weather-show", userInput: command, response: "Checking current weather." }
        }
        if (lower.includes("youtube") || lower.startsWith("play")) {
            const q = lower.replace(/play|on youtube|youtube/gi, '').trim() || command
            return { type: "youtube-play", userInput: q, response: `Playing ${q} on YouTube.` }
        }
        if (lower.includes("search") || lower.includes("google")) {
            const q = lower.replace(/search|on google|google|for/gi, '').trim() || command
            return { type: "google-search", userInput: q, response: `Searching Google for ${q}.` }
        }
        if (lower.includes("who made you") || lower.includes("who created you")) {
            return { type: "general", userInput: command, response: `I was created by ${userData?.name || "you"}!` }
        }
        return {
            type: "general",
            userInput: command,
            response: `I heard: ${command}`
        }
    }

    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command }, { withCredentials: true })
            if (result.data) {
                return result.data
            }
        } catch (error) {
            console.log("Using client-side assistant engine:", error.message)
        }
        return fallbackResponse(command)
    }

    useEffect(() => {
        handleCurrentUser()
    }, [])

    const value = {
        serverUrl,
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext
