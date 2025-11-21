import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './styles/styles.css'
import App from './src/App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/admin/Admin'

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
)
