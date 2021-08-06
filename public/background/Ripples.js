class Ripple {
    constructor (Renderer, Array) {
        this.radius = 5;
        this.alpha = 1;
        this.x = Math.random() * Renderer.Size().width;
        this.y = Math.random() * Renderer.Size().height;
        this.Renderer = Renderer;
        this.Array = Array;
        this.alive = true;

    }

    update () {
        this.radius += 2;
        this.alpha -= 0.01;
        if (this.alive) this.render();

        if (this.radius > Math.max(this.Renderer.Size().x, this.Renderer.Size().y) || this.alpha <= 0.01) {
            this.delete();
        }
    }

    render () {
        this.Renderer.DrawShape([{type: "Arc", x: this.x, y: this.y, radius: this.radius, startAngle: 0, endAngle: Math.PI * 2}], {
            fill: "#00000000",
            line: {width: 10},
            //3cf0e7f0
            stroke: {type: "RadialGradient", x1: this.x, y1: this.y, r1: this.radius - 5, x2: this.x, y2: this.y, r2: this.radius + 5, stops: [{offset: 0, color:"#b3fffb"}, {offset: 0.5, color:"#00000000"}, {offset: 1, color:"#b3fffb"}]},
            alpha: this.alpha
        })
    }

    delete () {
        this.alive = false;
        this.Array.splice(this.Array.indexOf(this), 1);
    }
}

class Ripples {
    constructor (Renderer = new CanvasRenderer(), Events = new EventManager(), Odds = 0.8) {

        this.Renderer = Renderer;
        this.EventManager = Events;
        this.Ripples = [];
        this.Odds = Odds;
    }

    pause () {
        this.EventManager.unSubscribe(this);
    }

    resume () {
        this.EventManager.subscribe(this, 'tick', () => {

            if (document.getElementById('root')) this.Renderer.Size({width: document.getElementById('root').scrollWidth, height: document.getElementById('root').scrollHeight});

            this.Renderer.DrawShape([{x: 0, y: 0}, {x: this.Renderer.Size().width, y: 0}, {x: this.Renderer.Size().width, y: this.Renderer.Size().height}, {x: 0, y: this.Renderer.Size().height}], {stroke: "#00000000", fill: "#30a6f0"})

            if (Math.random() > this.Odds) {
                this.Ripples.push(new Ripple(this.Renderer, this.Ripples));
            }

            this.Ripples.forEach(i => i.update());
        })
    }

    getData () {
        return this.Renderer.GetImageData();
    }
}

let Canvas = new CanvasRenderer({size: {width: window.innerWidth, height: window.innerHeight}}, document.getElementById('canvas'))
let Events = new EventManager();
let Background = new Ripples(Canvas, Events);
Background.resume();