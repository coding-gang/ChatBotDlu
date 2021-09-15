export class Schedule {
  thu() {
    return this.thu;
  }
  morning() {
    return this.morning;
  }
  afternoon() {
    return this.afternoon;
  }
  evening() {
    return this.evening;
  }

  emptyMorning(){
    return this.emptyMorning;
  }

  emptyAfternoon(){
    return this.emptyAfternoon;
  }

  emptyEveningNoon(){
    return this.emptyEveningNoon;
  }

  setThu(thu) {
    this.thu = thu;
  }
  setMorning(morning) {
    this.morning = morning;
  }
  setAfternoon(afternoon) {
    this.afternoon = afternoon;
  }
  setEvening(evening) {
    this.evening = evening;
  }
  displayMorningNoon(emptyMorning) {
    this.emptyMorning = emptyMorning;
  }
  displayAfternoonNoon(emptyAfternoon) {
    this.emptyAfternoon = emptyAfternoon;
  }
  displayEveningNoon(emptyEveningNoon) {
    this.emptyEveningNoon = emptyEveningNoon;
  }

}


