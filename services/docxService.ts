import mammoth from 'mammoth';

export const processDocxFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          reject(new Error("Failed to read file"));
          return;
        }

        const options = {
          styleMap: [
            // English
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Heading 4'] => h4:fresh",
            "p[style-name='Heading 5'] => h5:fresh",
            "p[style-name='Heading 6'] => h6:fresh",
            "p[style-name='Title'] => h1:fresh",
            "p[style-name='Subtitle'] => h2:fresh",
            
            // Spanish
            "p[style-name='Título 1'] => h1:fresh",
            "p[style-name='Título 2'] => h2:fresh",
            "p[style-name='Título 3'] => h3:fresh",
            "p[style-name='Título 4'] => h4:fresh",
            "p[style-name='Título 5'] => h5:fresh",
            "p[style-name='Título 6'] => h6:fresh",
            "p[style-name='Título'] => h1:fresh",
            "p[style-name='Subtítulo'] => h2:fresh",

            // Formatting
            "r[style-name='Strong'] => strong",
            "b => strong"
          ]
        };

        const result = await mammoth.convertToHtml({ arrayBuffer }, options);
        const rawHtml = result.value;
        const processed = cleanHtmlContent(rawHtml);
        resolve(processed);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const cleanHtmlContent = (htmlContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;

  // Filter out metadata (Keyword:, Título SEO, Meta, and English equivalents)
  const nodes = Array.from(body.children);
  const nodesToRemove: Element[] = [];

  nodes.forEach(node => {
    const text = node.textContent?.trim() || '';
    const lowerText = text.toLowerCase();
    if (
      lowerText.startsWith('keyword:') ||
      lowerText.startsWith('keywords:') ||
      lowerText.startsWith('título seo') ||
      lowerText.startsWith('seo title') ||
      lowerText.startsWith('meta')
    ) {
      nodesToRemove.push(node);
    }
  });

  nodesToRemove.forEach(n => n.remove());

  // Add target="_blank" to all links
  const links = body.querySelectorAll('a');
  links.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  return body.innerHTML;
};