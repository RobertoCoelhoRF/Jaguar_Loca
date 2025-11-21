import React from 'react'
import './Footer.css'

export default function Footer(){
	return (
		<footer className="footer site-footer" role="contentinfo">
			<div className="container footer-grid">
				<div className="footer-brand">
					<strong>JaguarLoca</strong>
					<div className="small">Locadora de veículos — Jaguaruana / CE</div>
				</div>
			</div>

			<div className="container" style={{marginTop:16}}>
				<div className="small" style={{opacity:.9}}>© {new Date().getFullYear()} JaguarLoca — Todos os direitos reservados.</div>
			</div>
		</footer>
	)
}

