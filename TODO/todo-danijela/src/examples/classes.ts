export enum Cat { Legs = 4 }

interface Loyalty {
	beLoyal(): any;
}

export default class Animal {
	private _type: Cat;

	get type() { return this._type; }

	constructor(type: Cat) { this._type = type; }
}

export class Lion extends Animal implements Loyalty {
	private _name: string;

	constructor(name: string) {
		super(Cat.Legs);
		this._name = name;
	}

	beLoyal() { }
}
