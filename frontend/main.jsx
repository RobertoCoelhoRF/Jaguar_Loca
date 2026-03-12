import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './styles/styles.css'
import App from './src/App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/admin/Admin'
import MinhasReservas from './pages/minhas-reservas/MinhasReservas'
import { ModalProvider, useModalContext } from './context/ModalContext'
import ModalContainer from './components/ModalContainer'

function RootContent() {
	const { modals, close } = useModalContext()

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="/minhas-reservas" element={<MinhasReservas />} />
				</Routes>
			</BrowserRouter>
			<ModalContainer modals={modals} onClose={close} />
		</>
	)
}

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)

root.render(
	<React.StrictMode>
		<ModalProvider>
			<RootContent />
		</ModalProvider>
	</React.StrictMode>
)
