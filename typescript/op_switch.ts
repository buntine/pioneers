class OpSwitch {
  private button : Snap.Element;
  private text : Snap.Element;
  private coords : Array<[number, number, string]>;

  private static WIDTH = 100;
  private static HEIGHT = 47;

  constructor(public svg:Snap.Paper, public speed=150) {
    this.coords = [
      [0, 15, "or"],
      [OpSwitch.WIDTH / 2, 7, "and"],
    ];
  }

  private drawBg() : void {
    let bg = this.svg.rect(0, 0, OpSwitch.WIDTH, OpSwitch.HEIGHT, 5);
    bg.attr({fill: "#fff", cursor: "pointer"});
  }

  private drawBgTexts() : void {
    for (let c of this.coords) {
      let text = this.svg.text(c[0] + c[1], 28, c[2]);
      text.attr({fill: "#aaa", cursor: "pointer"});
    }
  }

  private drawOpGroup() : Snap.Element {
    this.button = this.svg.rect(0, 0, OpSwitch.WIDTH / 2, OpSwitch.HEIGHT, 5);
    this.text = this.svg.text(this.coords[0][1], 28, "or");
    this.text.attr({fill: "#fff", cursor: "pointer"});
    this.button.attr({fill: "#4484c7", cursor: "pointer"});

    return this.svg.group(this.button, this.text);
  }

  public draw(f: (s:string) => void) : void {
    this.drawBg();
    this.drawBgTexts();
    let ops = this.drawOpGroup();

    this.svg.click((e:MouseEvent) => {
      let n = (this.text.attr("text") == this.coords[0][2]) ? 1 : 0;
      let c = this.coords[n];

      this.button.animate({x: c[0]}, this.speed);
      this.text.animate({x: c[0] + c[1]}, this.speed);
      this.text.attr({text: c[2]});

      f(this.text.attr("text").toUpperCase());
    });
  }
}
