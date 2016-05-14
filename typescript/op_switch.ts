type OpSwitchState = number;

class OpSwitch {
  private text : Snap.Element;
  private state : OpSwitchState;
  private coords : Array<[number, string]>;

  constructor(public svg:Snap.Paper, public ops:[string, string], public speed=150, public width=100, public height=46) {
    this.coords = [
      [0, ops[0]],
      [this.width / 2, ops[1]],
    ];

    this.state = 0;
  }

  private centerText(txt:Snap.Element) : void {
    let bbox = txt.getBBox();

    txt.transform(`translate(${(this.width / 4) - (bbox.w / 2)},
                             ${(this.height / 2) + (bbox.h / 4)})`);
  }

  private drawBg() : void {
    let bg = this.svg.rect(0, 0, this.width, this.height, 5);
    bg.attr({fill: "#fff", cursor: "pointer"});
  }

  private drawBgTexts() : void {
    for (let c of this.coords) {
      let text = this.svg.text(c[0], 0, c[1]);
      text.attr({fill: "#aaa", cursor: "pointer"});
      this.centerText(text);
    }
  }

  private drawOpGroup() : Snap.Element {
    let button = this.svg.rect(0, 0, this.width / 2, this.height, 5);

    button.attr({fill: "#56abfb", cursor: "pointer"});

    this.text = this.svg.text(0, 0, this.coords[0][1]);
    this.text.attr({fill: "#fff", cursor: "pointer"});
    this.centerText(this.text);

    return this.svg.group(button, this.text);
  }

  public draw(f: (s:OpSwitchState, t:string) => void) : void {
    this.drawBg();
    this.drawBgTexts();
    let ops = this.drawOpGroup();

    this.svg.click((e:MouseEvent) => {
      this.state = (this.state == 0) ? 1 : 0;
      let c = this.coords[this.state];

      ops.animate({transform: `translate(${c[0]},0)`}, this.speed);

      this.text.attr({text: c[1]});
      this.centerText(this.text);

      f(this.state, c[1]);
    });
  }
}
