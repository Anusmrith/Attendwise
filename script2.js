function calculateAttendance(attended, total) {
    let percentage = (attended / total) * 100;
    
  
    return percentage;
}
    let attendance = calculateAttendance(61, 75);

console.log(attendance);