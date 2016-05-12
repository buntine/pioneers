class OpSwitch {
  private button : Snap.Element;
  private text : Snap.Element;
  private coords : Array<[number, number, string]>;

  constructor(public svg:Snap.Paper) {
    this.coords = [
      [2, 15, "or"],
      [48, 52, "and"],
    ];
  }

  public draw(f: (s:string) => void) : void {
    this.button = this.svg.rect(this.coords[0][0], 2, 46, 42, 5);
    this.text = this.svg.text(this.coords[0][1], 28, "or");
    this.text.attr({fill: "#fff", cursor: "pointer"});
    this.button.attr({fill: "#4484c7", cursor: "pointer"});

    let op_group = this.svg.group(this.button, this.text);

    op_group.click((e:MouseEvent) => {
      let n = (this.text.attr("text") == this.coords[0][2]) ? 1 : 0;
      let c = this.coords[n];

      this.button.animate({x: c[0]}, 150);
      this.text.animate({x: c[1]}, 150);
      this.text.attr({text: c[2]});

      f(this.text.attr("text"));
    });
  }
}
