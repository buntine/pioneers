declare var $:any;

interface IWin {
  name: string;
  year: number;
}

interface IAchievement {
  description: string;
  source: string;
  impact: number;
  year: number;
}

class Person {
  name: string;
  country: string;
  gender: string;
  impact: number;
  biography: string;
  picture: string;
  source: string;
  yob: number;
  yod: number;
  wins: Array<IWin>;
  achievements: Array<IAchievement>;

  constructor(p: {name: string}) {
    this.name = p.name;
  }

  test() {
    return "Hello " + this.name;
  }
}

$(function(){
  $.getJSON("/people", {"tag": ["www", "internet"], "op": "OR"},
    (d:any) => {
      let people: Person[] = $.map(d.people, (p:any) => {return new Person(p)});

      console.log(people[0].test());
    }
  );
});
