type TogglerState = number;
type TogglerOption = string;

class Toggler {
  private text : Snap.Element;
  private opGroup : Snap.Element;
  private state : TogglerState;
  private options : [TogglerOption, TogglerOption];
  private callback : (s:TogglerState, o:TogglerOption) => void;

  constructor(public svg:Snap.Paper, ops:[string, string], public speed=150, public width=100, public height=46) {
    this.options = ops;
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
    for (let n of [0, 1]) {
      let text = this.svg.text((this.width / 2) * n, 0, this.options[n]);
      text.attr({fill: "#aaa", cursor: "pointer"});
      this.centerText(text);
    }
  }

  private drawOpGroup() : Snap.Element {
    let button = this.svg.rect(0, 0, this.width / 2, this.height, 5);

    button.attr({fill: "#56abfb", cursor: "pointer"});

    this.text = this.svg.text(0, 0, this.options[0]);
    this.text.attr({fill: "#fff", cursor: "pointer"});
    this.centerText(this.text);

    return this.svg.group(button, this.text);
  }

  private toggleState(triggerCallback:boolean) : void {
    this.state = (this.state == 0) ? 1 : 0;

    let o = this.options[this.state];

    this.opGroup.animate({transform: `translate(${(this.width / 2) * this.state},0)`}, this.speed);

    this.text.attr({text: o});
    this.centerText(this.text);

    if (triggerCallback) {
      this.callback(this.state, o);
    }
  }

  public draw(f: (s:TogglerState, t:string) => void) : Toggler {
    this.drawBg();
    this.drawBgTexts();
    this.opGroup = this.drawOpGroup();
    this.callback = f;

    this.svg.click((e:MouseEvent) => this.toggleState(true));

    return this;
  }

  public getState() : [TogglerState, TogglerOption] {
    return [this.state, this.options[this.state]];
  }

  public setTo(t:string) : void {
    let current = this.options[this.state];

    if (current !== t) {
      this.toggleState(false);
    }
  }
}
