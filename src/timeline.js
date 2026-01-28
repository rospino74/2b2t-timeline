import { searchBestYPosition, getDaysDiff } from './utils.js';

/**
 * An Event in the Timeline
 * @typedef TimelineEvent
 * @property {Date} date - The date of the event
 * @property {string} description - The description of the event
 * @property {boolean} isMajor - Whether the event is a major event
 * @property {string?} wikiUrl - Optional URL to the wiki page about the event
 */

/**
 * A specific Age in the Timeline
 * @typedef TimelineAge
 * @property {Date} startDate - The starting date of the age
 * @property {Date} endDate - The ending date of the age
 * @property {string} name - The name of the age
 * @property {[string, string]} version - The Minecraft versions included in this age
 * @property {[number, number]} playerCount - The average min and max player count during this age
 * @property {string} background - The background cover URL
 * @property {string} color - The css color of the age
 */

/**
 * Numero di pixel per giorno nella timeline
 */
const PIXELS_PER_DAY = 0.6;

const TIMELINE_PADDING_Y = 20;
const BOX_PADDING_Y = 10;

/**
 * Qui salviamo le posizioni finali {x, y, w, h}
 * @type {{x: number, y: number, w: number, h: number}[]}
 */
const placedRects = [];

function createYearMarker(container, year, xPos) {
    // First let's create the container and the marker
    const group = document.createElement('div');
    group.className = 'year-group';
    container.appendChild(group);

    const marker = document.createElement('div');
    marker.className = 'year-marker';
    marker.style.height = `${TIMELINE_PADDING_Y}px`;
    group.appendChild(marker);

    // Now lets focus on the label
    const label = document.createElement('div');
    label.className = 'year-label';
    label.innerText = year;

    // Add it to the container
    group.appendChild(label);

    // Center the group on the xPos
    const newX = xPos - (label.offsetWidth / 2);
    group.style.left = `${newX}px`;

    // Measure the dimensions of the label and save for collision detection
    placedRects.push({
        x: newX,
        y: TIMELINE_PADDING_Y,
        w: label.offsetWidth,
        h: label.offsetHeight
    });
}

/**
 * Costruisce la linea temporale degli anni partendo dall'evento più vecchio
 * fino a quello più recente.
 * 
 * Costruisce il relativo evento nel DOM.
 * 
 * @param {HTMLElement} container Il container dove appendere la linea
 * @param {TimelineEvent[]} events Array di eventi
 */
export function createYearLine(container, startDate, endDate) {
    // Then calculate how much space we need
    const totalDays = getDaysDiff(startDate, endDate) + 50; // Extra 50 days padding
    const lineWidth = totalDays * PIXELS_PER_DAY;

    // Create year markers
    const yearLine = container.querySelector('.year-line');
    yearLine.style.width = `${lineWidth}px`;

    // Now we want to add year markers starting from the following year
    const eventArea = container.querySelector('.events-area');
    const currentDate = new Date(startDate.getFullYear() + 1, 0, 1);
    do {
        const daysFromStart = getDaysDiff(startDate, currentDate);
        createYearMarker(eventArea, currentDate.getFullYear(), daysFromStart * PIXELS_PER_DAY);

        // Move to the next year
        currentDate.setFullYear(currentDate.getFullYear() + 1);
    } while (currentDate <= endDate);
}

export function createMajorEvent(eventArea, event, startDate) {
    // First let's create the container, the marker and the label
    const group = document.createElement('div');
    group.className = 'event-group major-event';
    group.style.visibility = 'hidden';
    eventArea.appendChild(group);

    const marker = document.createElement('div');
    marker.className = 'event-marker';
    group.appendChild(marker);

    const el = document.createElement('span');
    el.className = 'event-label';
    el.innerHTML = `${event.description}<br>(${event.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`;
    group.appendChild(el);

    // Then center the group
    const daysFromStart = getDaysDiff(startDate, event.date);
    const xPos = daysFromStart * PIXELS_PER_DAY - (el.offsetWidth / 2);
    group.style.left = `${xPos}px`;

    // And finally show the element
    group.style.visibility = 'visible';
}

export function createEvent(eventArea, event, startDate) {
    // First let's create the container and the marker
    const group = document.createElement('div');
    group.className = 'event-group';
    group.style.visibility = 'hidden'; // Nascondi per misurare
    eventArea.appendChild(group);

    const marker = document.createElement('div');
    marker.className = 'event-marker';
    group.appendChild(marker);

    // Then create the label
    const el = document.createElement('span');
    el.className = 'event-label';
    el.innerHTML = `${event.description}<br>(${event.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`;

    group.appendChild(el);

    // Now we need to center the group
    const daysFromStart = getDaysDiff(startDate, event.date);
    const xPos = daysFromStart * PIXELS_PER_DAY - (el.offsetWidth / 2);
    group.style.left = `${xPos}px`;

    // And finally start the gravity algorithm
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    let bestY = searchBestYPosition(xPos, width, height, BOX_PADDING_Y / 2, placedRects);
    marker.style.height = (bestY + BOX_PADDING_Y) + 'px';

    // Save the position
    placedRects.push({
        x: xPos,
        y: bestY,
        w: width,
        h: height
    });

    // After everything is done show the element
    group.style.visibility = 'visible';
}

export function createAgeCover(ageArea, age, startDate) {
    // First let's create the container with the background
    const group = document.createElement('div');
    group.className = 'age-cover';
    group.style.setProperty("--event-text-color", age.color);
    group.innerHTML = `
    <div class="age-background" style="background-image: url(${age.background})"></div>
    <div class="age-name">${age.name}</div>
    <div class="age-meta">${age.version.join(' - ')}</div>
    <div class="age-meta">(${age.playerCount?.[0] ?? 0} - ${age.playerCount?.[1] ?? 0} Players)</div>
    `;

    const startX = getDaysDiff(startDate, age.startDate) * PIXELS_PER_DAY;
    const endX = getDaysDiff(startDate, age.endDate ?? age.startDate) * PIXELS_PER_DAY;
    const width = Math.max(0, endX - startX);

    group.style.left = `${startX}px`;
    group.style.width = `${width}px`;

    // Finally add to the DOM
    ageArea.appendChild(group);
}