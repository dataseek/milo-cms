import { CardData } from './types';

export const DEFAULT_IMAGE_URL = 'https://cdn.prod.website-files.com/66d052db781718d42caceaaa/69849c8a6ebf97ec4989e500_ic-blog-d1-kpi-cobranza-lg.webp';
export const DEFAULT_AVATAR_URL = 'https://cdn.prod.website-files.com/66d052db781718d42caceaaa/691dd22a1dae0c4af657a499_paolo.webp';

// CSS for Featured Card
const FEATURED_CSS = `
  .custom-card-1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #C1CCFD;
    border-radius: 24px!important;
    background: #FFF;
    font-family: "Manrope","TT Firs Neue Variable", sans-serif;
    overflow: hidden;
    margin: 1rem 0 0rem!important;
    height: 249px;
    box-sizing: border-box;
  }

  .card-text {
    padding: 35px;
    flex: 1;
    box-sizing: border-box;
  }

  .card-tag {
     display: inline-flex;
    padding: 10px;
    align-items: center;
    gap: 7.859px;
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    border-radius: 25px;
    border: 0.295px solid #FFF;
    background: #000414;
    text-align: center;
    margin-bottom: 12px;
    min-width: 65px!important;
    justify-content: center;
    line-height: 100%;
    align-self: flex-start;
  }

  .card-title {
    font-size: 22px;
    line-height: 1.4;
    margin: 0 0 20px 0;
    color: #000;
    font-weight: 400;
  }

  .card-title strong {
    font-weight: 500;
  }

  .card-link {
    text-decoration: underline;
    font-size: 22px;
    font-weight: 400;
    color: #2c52fd;
  }

  .card-image {
    flex-shrink: 0;
    width: 240px;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 24px;
    margin: 0px!important;
  }
  .card-text p strong{ 
    font-weight: 500!important;
  }
  .card-text .p-without-download a{
     font-weight: 500!important;
  }
  .arrow-desktop {
    width: 22px;
    height: auto;
    margin-top: 20px;
    object-fit: cover;
    display: block;
  }
  .card-tag .p-without-download{
    margin-bottom:0!important;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .custom-card-1 {
      flex-direction: column;
      padding: 24px;
      max-width: 100%;
      height: 100%;
    }

    .card-text {
      padding: 0!important;
      width: 100%;
    }

    .card-image {
      display: none!important;
    }

    .card-title {
      font-size: 18px!important;
    }

    .card-link {
      font-size: 18px!important;
    }

    .card-tag {
      border-radius: 15px!important;
      font-size: 10px!important;
      padding: 10px!important;
      min-width: 25px!important;
      justify-content: center!important;
      line-height: 100% !important;
    }
    .arrow-desktop {
      display: none!important;
    }
    .card-tag .p-without-download{
      margin-bottom:0!important;
    }
  }
`;

// CSS for Testimonial Card
const TESTIMONIAL_CSS = `
  .testimonial_slider-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background-color: #F4F6FB; /* Aproximación de color de fondo si no es blanco */
    border-radius: 24px;
    padding: 40px;
    font-family: "Manrope","TT Firs Neue Variable", sans-serif;
    margin: 2rem 0;
    border: 1px solid #E5E7EB;
  }
  
  .testimonial_slider-content {
    margin-bottom: 24px;
  }
  
  .testimonial_slider-content .heading-4 {
    font-size: 24px;
    line-height: 1.4;
    color: #000414;
    font-weight: 400;
    margin: 0;
  }
  
  .testimonial_slider-content strong {
    font-weight: 700;
  }

  .testimonial_slider-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: auto;
  }

  .testimonial_slider-photo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    flex-shrink: 0;
  }

  .testimonial_slider_info-text {
    display: flex;
    flex-direction: column;
  }

  .text-size-regular {
    font-size: 16px;
    line-height: 1.5;
    color: #4B5563;
  }

  .text-weight-bold {
    font-weight: 700;
    color: #000414;
  }

  @media (max-width: 768px) {
    .testimonial_slider-card {
      padding: 24px;
    }
    .testimonial_slider-content .heading-4 {
      font-size: 20px;
    }
  }
`;

export const CARD_CSS = `<style>\n${FEATURED_CSS}\n${TESTIMONIAL_CSS}\n</style>`;

export const generateCardHTML = (card: CardData, index: number = 0) => {
  if (card.type === 'testimonial') {
    return generateTestimonialHTML(card, index);
  }
  return generateFeaturedHTML(card, index);
};

const generateFeaturedHTML = (card: CardData, index: number) => {
  const { tag, description, url, linkText, imageUrl, linkOnNewLine } = card;

  // Inline styles
  const s = {
    card: 'display: flex; align-items: center; justify-content: space-between; border: 1px solid #C1CCFD; border-radius: 24px!important; background: #FFF; font-family: "Manrope", "TT Firs Neue Variable", sans-serif; overflow: hidden; margin: 2rem 0 3rem!important; height: 249px; box-sizing: border-box; text-decoration: none;',
    textCol: 'padding: 35px; flex: 1; box-sizing: border-box; padding-right: 35px; display: flex; flex-direction: column; justify-content: center;',
    tag: 'display: inline-flex; padding: 10px; align-items: center; gap: 7.859px; color: #fff; font-size: 11px; font-weight: 500; border-radius: 25px!important; border: 0.295px solid #FFF; background: #000414; text-align: center; margin-bottom: 12px; min-width: 65px!important; justify-content: center; line-height: 100%; align-self: flex-start;',
    pTitle: 'font-size: 22px; line-height: 1.4; margin: 0; margin-bottom: 0 !important; color: #000; font-weight: 400;',
    link: 'text-decoration: underline; font-size: 22px; font-weight: 500; color: #2c52fd;',
    img: 'flex-shrink: 0; width: 240px; height: 100%; object-fit: cover; display: block; border-radius: 24px; margin: 0px!important;'
  };

  const linkSeparator = description && linkText 
    ? (linkOnNewLine ? '<br>' : '&nbsp;') 
    : '';

  return `
<div class="custom-card-1" id="card-featured-${index}" style="${s.card}">
  <div class="card-text" style="${s.textCol}">
    <div class="card-tag" style="${s.tag}">${tag}</div>
     <p class="card-title p-without-download" style="${s.pTitle}">
        ${description}${linkSeparator}
        <a href="${url}" target="_blank" class="card-link" style="${s.link}">${linkText}</a>
      </p>	
  </div>
  <img class="card-image" src="${imageUrl}" alt="Imagen guía" style="${s.img}">
</div>
`;
};

const generateTestimonialHTML = (card: CardData, index: number) => {
  const { description, imageUrl, authorName, authorRole } = card;

  // Inline styles for Testimonial
  const s = {
    card: 'display: flex; flex-direction: column; justify-content: space-between; background-color: #F4F6FB; border-radius: 24px; padding: 40px; font-family: "Manrope", sans-serif; margin: 2rem 0; border: 1px solid #E5E7EB;',
    contentDiv: 'margin-bottom: 24px;',
    p: 'font-size: 24px; line-height: 1.4; color: #000414; font-weight: 400; margin: 0;',
    infoDiv: 'display: flex; align-items: center; gap: 16px; margin-top: auto;',
    photo: `width: 60px; height: 60px; border-radius: 50%; background-size: cover; background-position: center; background-repeat: no-repeat; flex-shrink: 0; background-image: url('${imageUrl}');`,
    textDiv: 'display: flex; flex-direction: column;',
    name: 'font-size: 16px; line-height: 1.5; font-weight: 700; color: #000414;',
    role: 'font-size: 16px; line-height: 1.5; color: #4B5563;'
  };

  return `
<div class="testimonial_slider-card text-color-primary" id="card-testimonial-${index}" style="${s.card}">
    <div class="testimonial_slider-content" style="${s.contentDiv}">
        <div class="margin-bottom margin-small">
            <p class="heading-4" style="${s.p}">${description}</p>
        </div>
    </div>
    <div class="testimonial_slider-info" style="${s.infoDiv}">
        <div style="${s.photo}" class="testimonial_slider-photo"></div> 
            <div class="testimonial_slider_info-text" style="${s.textDiv}">
             <div class="text-size-regular text-weight-bold" style="${s.name}">${authorName}</div>
            <div class="text-size-regular" style="${s.role}">${authorRole}</div> 
        </div>
    </div>
</div>
`;
};

// Default values
export const DEFAULT_CARD_DATA: CardData = {
  id: 'default',
  type: 'featured',
  tag: 'DEMO',
  description: 'Descubre cómo crear, configurar y supervisar un agente IA especializado en cobranzas.',
  linkText: 'Accede a la demo',
  url: 'https://www.inconcertcx.com/es/lp/demo-inagent-cobranzas',
  imageUrl: DEFAULT_IMAGE_URL,
  linkOnNewLine: true,
  authorName: 'Paolo Boni',
  authorRole: 'CEO de Inconcert'
};