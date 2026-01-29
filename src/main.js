import './style.css'
import { createYearLine, createEvent, createMajorEvent, createAgeCover } from './timeline.js';
import { events as rawEvents, ages as rawAges } from "./timeline.json";

// DOM references
const container = document.querySelector('#timeline-container');
const agesArea = container.querySelector('.ages-area');
const eventArea = container.querySelector('.events-area');

// Parse dates
const events = rawEvents.map(ev => ({
  ...ev,
  date: new Date(ev.date)
}));
const ages = rawAges.map(age => ({
  ...age,
  startDate: new Date(age.startDate),
  endDate: age.endDate ? new Date(age.endDate) : null
}));


// We first need to find the earliest and latest dates
const dates = events.map(ev => ev.date);
const startDate = new Date(Math.min(...dates));
const endDate = new Date(Math.max(...dates));

// Then we can create our year line
createYearLine(container, startDate, endDate);

// Render age covers
ages.forEach(age => {
  createAgeCover(agesArea, age, startDate);
});

// And finally place events
events.forEach(ev => {
  if (ev.isMajor) {
    createMajorEvent(agesArea, ev, startDate);
  } else {
    createEvent(eventArea, ev, startDate);
  }
});