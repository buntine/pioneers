class OpSwitch {
  private button : Snap.Element;
  private text : Snap.Element;
  private coords : Array<[number, number, string]>;

  constructor(public svg:Snap.Paper) {
    this.coords = [
      [2, 15, "or"],
      [48, 52, "and"]
    ];
  }

  public draw(f: (s:string) => void) : void {
    this.button = this.svg.rect(this.coords[0][0], 2, 46, 42, 5);
    this.text = this.svg.text(this.coords[0][1], 28, "or");
    this.text.attr({fill: "#fff", cursor: "pointer"});
    this.button.attr({fill: "#4484c7", cursor: "pointer"});

    let op_group = this.svg.group(this.button, this.text);

    op_group.click((e:MouseEvent) => {
      if (this.text.attr("text") == "or") {
        this.button.animate({x: 48}, 150);
        this.text.animate({x: 52}, 150);
        this.text.attr({text: "and"});
      } else {
        this.button.animate({x: 2}, 150);
        this.text.animate({x: 15}, 150);
        this.text.attr({text: "or"});
      }

      f(this.text.attr("text"));
    });
  }
}
