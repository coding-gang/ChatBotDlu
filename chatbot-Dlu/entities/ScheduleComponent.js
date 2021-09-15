export class ScheduleComponent {
  constructor(mon,  lop, tiet, phong, gv, dahoc,nhom = "") {
    this.lop = lop;
    this.mon = mon;
    this.nhom = nhom;
    this.tiet = tiet;
    this.phong = phong;
    this.gv = gv;
    this.dahoc = dahoc;
  }
 
}
