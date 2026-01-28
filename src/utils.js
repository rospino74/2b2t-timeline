/**
 * Get the number of days into the year for a given date.
 * @param {Date} date - The date to calculate
 * @returns {number} A number between 0 and 366
 * 
 * @see https://stackoverflow.com/a/40975730
*/
export function daysIntoYear(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

/**
 * Calculate the difference in days between two dates
 * @param {Date} start - The start date
 * @param {Date} date - The end date
 * @returns {number} Difference in days between date and start
 */
export function getDaysDiff(start, date) {
    return (date - start) / (1000 * 60 * 60 * 24);
}


/**
 * Finds the optimal Y position for an element using a gravity-based algorithm.
 * The element "falls" downward until it finds the first position without collisions.
 * 
 * @param {number} xPos - The X position of the element
 * @param {number} width - The width of the element
 * @param {number} height - The height of the element
 * @param {{x: number, y: number, w: number, h: number}[]} placedRects - Array of already placed rectangles
 * @returns {number} The optimal Y position without collisions
 */
export function searchBestYPosition(xPos, width, height, verticalPadding, placedRects) {
    let bestY = 0; // Start right under the timeline

    // Early return if no elements are placed yet
    if (placedRects.length === 0) {
        return bestY;
    }

    // Filter only rectangles that overlap horizontally with our element
    const horizontalColliders = placedRects.filter(rect =>
        (xPos < rect.x + rect.w) && (xPos + width > rect.x)
    );

    // If no horizontal overlap, we can place at Y=0
    if (horizontalColliders.length === 0) {
        return bestY;
    }

    // Sort colliders by Y position for more efficient collision checking
    horizontalColliders.sort((a, b) => a.y - b.y);

    // Keep checking for collisions and move down
    let hasCollision = true;
    let maxIterations = 1000; // Safety limit to prevent infinite loops
    let iterations = 0;

    while (hasCollision && iterations < maxIterations) {
        hasCollision = false;
        iterations++;

        // Check against all horizontally overlapping rectangles
        for (const other of horizontalColliders) {
            // Skip rectangles that are already above our current position
            if (other.y + other.h <= bestY) {
                continue;
            }

            // Check for vertical overlap
            if ((bestY < other.y + other.h + + verticalPadding) && (bestY + height + verticalPadding > other.y))
                // Collision detected! Move element below the obstacle
                bestY = other.y + other.h + verticalPadding;
            hasCollision = true;
            // Restart check from the beginning since we moved down
            break;
        }
    }

    return bestY;
}