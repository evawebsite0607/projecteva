import { PUBLIC_WP_API_URL } from '$env/static/public';

function extractImages(html) {
    const imageRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^"]*)"[^>]*>/g;

    const images = [];
    let match;

    while ((match = imageRegex.exec(html)) !== null) {
        images.push({
            src: match[1],
            alt: match[2] || 'Slider image'
        });
    }

    return images;
}

function extractHeading(html) {
    const headingRegex = /<h2[^>]*>(.*?)<\/h2>/;
    const match = html.match(headingRegex);

    return match ? match[1] : '';
}

export async function load({ fetch }) {
    const response = await fetch(`${PUBLIC_WP_API_URL}/pages?slug=home`);
    const pages = await response.json();
    const home = pages[0];

    const content = home.content.rendered;

    return {
        title: home.title.rendered,
        heading: extractHeading(content),
        images: extractImages(content)
    };
}