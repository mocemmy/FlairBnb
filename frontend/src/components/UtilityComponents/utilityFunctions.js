export const findCostOfStay = (pricePerNight, startDate, endDate) => {
    const numDays = findNumDaysOfStay(startDate, endDate)
    const calcPrice = (numDays * pricePerNight).toFixed(2)

    return calcPrice
}

export const findNumDaysOfStay = (startDate, endDate) => {
    const dayMillisecs = 1000 * 60 * 60 * 24;
    if(typeof(startDate) !== 'object') {
        startDate = new Date(startDate)
        endDate = new Date(endDate)
    }

    const numDays = Math.floor((endDate.getTime() - startDate.getTime()) / dayMillisecs )
    return numDays
}