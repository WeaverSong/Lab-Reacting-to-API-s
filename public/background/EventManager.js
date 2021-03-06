/*

    Handles events. All methods return a boolean of whether they succeeded.

*/

/*
    This project doesn't use the EventManager very much. I am using it in the Ripples as that is part of a larger project idea that needs the full power of my little event library. I didn't bother swapping away, because I'm kindof lazy, and managing to impor this into a react project proved surprisingly dificult.

    Anyways, much thanks to you guys. I was inspired to write the EventManager and CanvasRenderer libraries after learning Classes, and I very much love them already.
*/
class EventManager
{
    constructor(events = [], tickLength = 16)
    {
        //Prepare a blank queue.
        this.Queue = {
            preTick: {
                queue: [],
                condition: () => true
            },
            tick: {
                queue: [],
                condition: () => true
            },
            postTick: {
                queue: [],
                condition: () => true
            }
        };

        //Add an array of events
        events.forEach(i => this.addEvent(i.name, i.condition));

        //Calls the tick event every tickLength ms. Tracks how long it has been between each tick, to give a warning if it is lagging.
        this.lastTick = Date.now();
        this.tickLength = tickLength;

        //Call the tick function
        setInterval(() => this.#tick(), tickLength)

    }

    //Fires an event with an optional trigger object.
    fire(event, triggers = {})
    {
        //Return false if the event doesn't exist.
        if (this.Queue[event] === undefined) return false;

        this.Queue[event].queue.forEach(ele =>
        {
            //If the event's condition function accepts the element, call its function.
            if (this.Queue[event].condition(ele, triggers))
            {
                ele.func(triggers);
            }

        });
        return true;
    };

    //Subscribes to a specified event.
    subscribe(source, event, func)
    {
        //Fail if there was something wrong with the event or inputs
        if (typeof (func) !== "function"
            || this.Queue[event] === undefined
            || this.Queue[event].queue === undefined
            || typeof (source) !== "object") return false;

        this.Queue[event].queue.push({ func: func, source: source });

        return true;
    };

    //Removes your subscriptions, or only for one event if specified
    unSubscribe(source, event)
    {
        //If event is undefined, we want to unsubscribe from all events
        if (event === undefined)
        {
            for (let key in this.Queue)
            {
                this.Queue[key].queue.forEach((ele, index) =>
                {
                    if (ele.source === source)
                    {
                        this.Queue[key].queue.splice(index, 1);
                    }
                });
            }
            return true;
        }
        else
        {
            //Fail if there was something wrong with the event or inputs
            if (this.Queue[event] == undefined
                || this.Queue[event].queue === undefined
                || typeof (source) !== 'object') return false;

            //Remove the subscribed function
            let event = this.Queue[event].queue;
            let temp = event.splice(
                event.indexOf(
                    event.find(i => i.source === source)
                ),
                1);

            //If we failed to remove it, return false;
            if (typeof (temp) !== "object") return false;

            return true;
        }
    }

    //Clears the specified event, or all events if none was specified.
    clearEvent(event)
    {
        if (event === undefined)
        {
            this.Queue = {
                preTick: {
                    queue: [],
                    condition: () => true
                },
                tick: {
                    queue: [],
                    condition: () => true
                },
                postTick: {
                    queue: [],
                    condition: () => true
                }
            };
        }
        else if (
            this.Queue[event] !== undefined
            && this.Queue[event].queue !== undefined
        )
        {
            this.Queue[event].queue = [];
        } else
        {
            return false;
        }

        return true
    }

    //Adds a new event.
    addEvent(name, condition)
    {
        this.Queue[name] = {
            queue: [],
            condition
        };
        return true;
    }

    //Removes an event
    removeEvent(name)
    {
        if (this.Queue[name] === undefined) return false;
        delete this.Queue[name];
        return true;
    }

    //Internal tick function.
    #tick()
    {
        try
        {
            //Check how long it has been since the last tick. Send warning if tick was late.
            let time = Date.now();
            let tickLength = time - this.lastTick;
            //Spammed if tab is not focused :(
            if (tickLength - this.tickLength > 100) console.warn(`EventManager is lagging behind by ${tickLength - this.tickLength}ms.`);
            this.lastTick = time;

            //fire the tick events
            this.fire('preTick');
            this.fire('tick');
            this.fire('postTick');
        } catch (e) {
            console.error("Tick function failed.", e);
            
        }
    }

};