'use client';

import React from 'react';
import styles from './WhatsAppButton.module.css';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // Se usa el número que ya estaba en el proyecto
  const phoneNumber = '51947432228'; 
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      className={styles.whatsapp_float}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp className={styles.whatsapp_icon} />
      <span className={styles.hover_text}>¿Necesitas ayuda?</span>
    </a>
  );
};

export default WhatsAppButton;