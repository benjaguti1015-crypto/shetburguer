/**
 * Configuración de la tarjeta de fidelidad.
 * Cambiá estos valores para ajustar la meta de sellos y los premios.
 */
export const LOYALTY_CONFIG = {
  /** Cantidad de sellos para completar la tarjeta */
  goal: 10,
  /** Sello en el que se entrega el premio intermedio */
  midRewardAt: 5,
  /** Texto del premio intermedio */
  midRewardText: "Papas fritas gratis",
  /** Texto del premio final */
  finalRewardText: "1 hamburguesa artesanal gratis",
  /** Nombre del local */
  brandName: "SHET BURGER",
  /** Usuario de Instagram del local */
  brandInstagram: "@shetburger",
};

/** Términos y condiciones (borrador editable) */
export const TERMS_TEXT = `BORRADOR DE TÉRMINOS Y CONDICIONES

1. El programa de fidelidad de ${LOYALTY_CONFIG.brandName} es gratuito y personal. Cada cliente se identifica con su usuario de Instagram.

2. Se otorga 1 sello por cada compra válida realizada en el local. Los sellos los carga únicamente el personal autorizado, escaneando el código QR del cliente o desde el panel de control.

3. Al llegar al sello ${LOYALTY_CONFIG.midRewardAt} el cliente obtiene: ${LOYALTY_CONFIG.midRewardText}.

4. Al completar los ${LOYALTY_CONFIG.goal} sellos el cliente obtiene: ${LOYALTY_CONFIG.finalRewardText}. Al canjearlo, la tarjeta vuelve a cero y puede comenzar de nuevo.

5. Los premios no son acumulables con otras promociones ni canjeables por dinero.

6. La acumulación de sellos puede pausarse temporalmente por falta de stock o cierre del local. En ese caso se avisa dentro de la aplicación.

7. ${LOYALTY_CONFIG.brandName} puede modificar o finalizar el programa en cualquier momento, avisando por sus redes oficiales.

8. Los datos solicitados (nombre, apellido y usuario de Instagram) se usan solamente para identificar la tarjeta y comunicar promociones.

(Texto de ejemplo: reemplazalo por la versión final de tu local.)`;
