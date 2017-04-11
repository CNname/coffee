define("ant.class", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Ant = (function () {
        function Ant(alpha, beta, q) {
            this.alpha = alpha;
            this.beta = beta;
            this.q = q;
            this.base = 0;
            this.walk = [];
            this.walkLength = null;
        }
        Ant.prototype.setBase = function (base) {
            this.base = base;
        };
        Ant.prototype.doWalk = function (distances, pheromones) {
            this.walk = [this.base];
            this.walkLength = null;
            for (var i = 1; i < distances.length; i++) {
                this.walk.push(this.chooseNext(this.walk[i - 1], distances, pheromones));
            }
            this.walk.push(this.walk[0]);
            this.walkLength = this.calcWalkLength(distances);
        };
        Ant.prototype.chooseNext = function (currentNode, distances, pheromones) {
            var sumall = 0;
            var unvisited = [];
            var probs = [];
            for (var i = 0; i < distances.length; i++) {
                if (this.walk.indexOf(i) === -1) {
                    unvisited.push(i);
                }
            }
            for (var i = 0; i < pheromones.length; i++) {
                if (i !== currentNode && unvisited.indexOf(i) !== -1) {
                    sumall += Math.pow(pheromones[currentNode][i], this.alpha) * Math.pow((1 / distances[currentNode][i]), this.beta);
                }
            }
            for (var i = 0; i < distances[currentNode].length; i++) {
                if (i !== currentNode && unvisited.indexOf(i) !== -1) {
                    var mul = Math.pow(pheromones[currentNode][i], this.alpha) * Math.pow((1 / distances[currentNode][i]), this.beta);
                    probs.push(mul / sumall);
                }
            }
            var rand = Math.random();
            var x = 0;
            var tally = probs[x];
            while (rand > tally && x < probs.length - 1) {
                tally += probs[++x];
            }
            return unvisited[x];
        };
        Ant.prototype.calcWalkLength = function (distances) {
            var length = 0;
            for (var i = 1; i < this.walk.length; i++) {
                length += distances[this.walk[i - 1]][this.walk[i]];
            }
            return length;
        };
        Ant.prototype.layPheromones = function (pheromones) {
            for (var i = 1; i < this.walk.length; i++) {
                pheromones[this.walk[i - 1]][this.walk[i]] += (1 / this.walkLength) * this.q;
                pheromones[this.walk[i]][this.walk[i - 1]] += (1 / this.walkLength) * this.q;
            }
        };
        return Ant;
    }());
    exports.Ant = Ant;
});
define("interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("aco.class", ["require", "exports", "ant.class"], function (require, exports, ant_class_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AcoAlgorithm = (function () {
        function AcoAlgorithm(alpha, beta, q, iterations, pheromone) {
            this.population = [];
            this.alpha = alpha;
            this.beta = beta;
            this.q = q;
            this.maxIterations = iterations;
            this.pheromone = pheromone;
            this.rho = 0.1;
        }
        AcoAlgorithm.prototype.setOnNewBest = function (onNewBest) {
            this.onNewBest = onNewBest;
        };
        AcoAlgorithm.prototype.setOnIteration = function (onIteration) {
            this.onIteration = onIteration;
        };
        AcoAlgorithm.prototype.init = function (coords) {
            this.popSize = 20;
            this.pheromones = [];
            this.bestSolution = null;
            this.goOn = true;
            this.calculateDistances(coords);
            for (var i = 0; i < this.popSize; i++) {
                this.population.push(new ant_class_1.Ant(this.alpha, this.beta, this.q));
            }
            for (var x = 0; x < this.distances.length; x++) {
                this.pheromones[x] = [];
                for (var y = 0; y < this.distances.length; y++) {
                    if (x !== y) {
                        this.pheromones[x][y] = this.pheromone;
                    }
                }
            }
        };
        AcoAlgorithm.prototype.iterate = function () {
            var _this = this;
            var z = 0;
            var update = (function (z) {
                setTimeout(function () {
                    _this.sendOutAnts();
                    _this.updatePheromones();
                    z++;
                    _this.daemonActions(z);
                    if (z < _this.maxIterations && _this.goOn) {
                        console.log('iteration ' + (z + 1));
                        update(z);
                    }
                }, 50);
            });
            update(z);
        };
        AcoAlgorithm.prototype.sendOutAnts = function () {
            for (var i = 0; i < this.popSize; i++) {
                this.population[i].doWalk(this.distances, this.pheromones);
            }
        };
        AcoAlgorithm.prototype.updatePheromones = function () {
            this.evaporatePheromones();
            for (var i = 0; i < this.popSize; i++) {
                this.population[i].layPheromones(this.pheromones);
            }
        };
        AcoAlgorithm.prototype.evaporatePheromones = function () {
            for (var x = 0; x < this.distances.length; x++) {
                for (var y = 0; y < this.distances.length; y++) {
                    if (x !== y) {
                        this.pheromones[x][y] = (1 - this.rho) * this.pheromones[x][y];
                    }
                }
            }
        };
        AcoAlgorithm.prototype.daemonActions = function (x) {
            for (var i = 0; i < this.popSize; i++) {
                if (!this.bestSolution || this.population[i].walkLength < this.bestLength) {
                    this.bestSolution = JSON.parse(JSON.stringify(this.population[i].walk));
                    this.bestLength = JSON.parse(JSON.stringify(this.population[i].walkLength));
                    if (this.onNewBest) {
                        this.onNewBest(x, this.bestSolution, this.bestLength);
                    }
                }
            }
        };
        AcoAlgorithm.prototype.calculateDistances = function (dist) {
            this.distances = [];
            for (var i = 0; i < dist.length; i++) {
                this.distances[i] = [];
                for (var j = 0; j < dist.length; j++) {
                    if (i !== j) {
                        var subX = dist[i].x - dist[j].x, subY = dist[i].y - dist[j].y;
                        var distance = Math.sqrt(Math.pow(subX, 2) + Math.pow(subY, 2));
                        this.distances[i][j] = distance;
                    }
                }
            }
        };
        return AcoAlgorithm;
    }());
    exports.AcoAlgorithm = AcoAlgorithm;
});
define("canvas-handler.class", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CanvasHandler = (function () {
        function CanvasHandler(canvasId) {
            this.initCanvas(canvasId);
        }
        CanvasHandler.prototype.initCanvas = function (canvasId) {
            try {
                var c = document.getElementById(canvasId);
                this.ctx = c.getContext('2d');
            }
            catch (err) {
                console.error(err);
            }
        };
        CanvasHandler.prototype.getCtx = function () {
            return this.ctx;
        };
        return CanvasHandler;
    }());
    exports.CanvasHandler = CanvasHandler;
});
define("greedy.class", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GreedyAlgorithm = (function () {
        function GreedyAlgorithm(home, coords) {
            this.home = home;
            this.coords = coords;
        }
        GreedyAlgorithm.prototype.findClosestPoint = function (pointArray, currentCoords) {
            var currentX = currentCoords.x;
            var currentY = currentCoords.y;
            var distArr = [];
            for (var i = 0; i < pointArray.length; i++) {
                var subX = currentX - pointArray[i].x, subY = currentY - pointArray[i].y;
                var distance = Math.sqrt(Math.pow(subX, 2) + Math.pow(subY, 2));
                distArr.push({
                    index: i,
                    distance: distance
                });
            }
            distArr = distArr.sort(function (a, b) {
                return a.distance - b.distance;
            });
            return distArr[0];
        };
        GreedyAlgorithm.prototype.drawPath = function (ctx) {
            var coordsArray = JSON.parse(JSON.stringify(this.coords));
            coordsArray.splice(this.home, 1);
            var current = this.coords[this.home];
            var totalDistance = 0;
            while (coordsArray.length > 0) {
                var closestPoint = this.findClosestPoint(coordsArray, current);
                var closest = coordsArray[closestPoint.index];
                this.canvas_arrow(ctx, current.x, current.y, closest.x, closest.y);
                totalDistance += closestPoint.distance;
                current = closest;
                coordsArray.splice(closestPoint.index, 1);
            }
            var subX = current.x - this.coords[this.home].x, subY = current.y - this.coords[this.home].y;
            var distance = Math.sqrt(Math.pow(subX, 2) + Math.pow(subY, 2));
            totalDistance += distance;
            this.canvas_arrow(ctx, current.x, current.y, this.coords[this.home].x, this.coords[this.home].y);
            ctx.strokeStyle = '#17192A';
            ctx.stroke();
            ctx.fillStyle = "#393b5b";
            ctx.font = "14px Arial";
            ctx.fillText("Kokonaispituus: " + Math.round(totalDistance), 10, 24);
        };
        GreedyAlgorithm.prototype.canvas_arrow = function (context, fromx, fromy, tox, toy) {
            var headlen = 5;
            var angle = Math.atan2(toy - fromy, tox - fromx);
            var endx = tox - (headlen * 2) * Math.cos(angle);
            var endy = toy - (headlen * 2) * Math.sin(angle);
            context.moveTo(fromx, fromy);
            context.lineTo(endx, endy);
            context.lineTo(endx - headlen * Math.cos(angle - Math.PI / 6), endy - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(endx, endy);
            context.lineTo(endx - headlen * Math.cos(angle + Math.PI / 6), endy - headlen * Math.sin(angle + Math.PI / 6));
        };
        return GreedyAlgorithm;
    }());
    exports.GreedyAlgorithm = GreedyAlgorithm;
});
require(['./canvas-handler.class', './greedy.class', './aco.class'], function (ch, g, a) {
    var CanvasHandler = ch.CanvasHandler;
    var GreedyAlgorithm = g.GreedyAlgorithm;
    var AcoAlgorithm = a.AcoAlgorithm;
    var acoCanvas = new CanvasHandler('aco-canvas');
    var greedyCanvas = new CanvasHandler('greedy-canvas');
    var CANVAS_WIDTH = 600;
    var CANVAS_HEIGHT = 400;
    var getCoords = function (amount) {
        var arr = [];
        for (var i = 0; i < amount; i++) {
            arr.push({
                x: Math.round(Math.random() * CANVAS_WIDTH),
                y: Math.round(Math.random() * CANVAS_HEIGHT)
            });
        }
        return arr;
    };
    var setCity = function (ctx, coords, radius, color) {
        if (radius === void 0) { radius = 5; }
        if (color === void 0) { color = '#17192A'; }
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    };
    var cityConfig = {};
    cityConfig.amount = parseInt(localStorage.getItem("cityCount")) || 50;
    cityConfig.coords = getCoords(cityConfig.amount);
    cityConfig.home = Math.round(Math.random() * cityConfig.amount);
    var drawCities = function (ctx) {
        for (var _i = 0, _a = cityConfig.coords; _i < _a.length; _i++) {
            var coord = _a[_i];
            if (cityConfig.home === cityConfig.coords.indexOf(coord)) {
                setCity(ctx, coord, 10);
            }
            else {
                setCity(ctx, coord);
            }
        }
    };
    drawCities(greedyCanvas.getCtx());
    drawCities(acoCanvas.getCtx());
    var greedy = new GreedyAlgorithm(cityConfig.home, cityConfig.coords);
    greedy.drawPath(greedyCanvas.getCtx());
    var alpha = 1.0, beta = 2.0, q = 1.0, iterations = parseInt(localStorage.getItem("acoIterations")) || 100, pheromone = 1 / cityConfig.amount;
    function onNewBest(i, walk, length) {
        var canvas_arrow = function (context, fromx, fromy, tox, toy) {
            var headlen = 5;
            var angle = Math.atan2(toy - fromy, tox - fromx);
            var endx = tox - (headlen * 2) * Math.cos(angle);
            var endy = toy - (headlen * 2) * Math.sin(angle);
            context.moveTo(fromx, fromy);
            context.lineTo(endx, endy);
            context.lineTo(endx - headlen * Math.cos(angle - Math.PI / 6), endy - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(endx, endy);
            context.lineTo(endx - headlen * Math.cos(angle + Math.PI / 6), endy - headlen * Math.sin(angle + Math.PI / 6));
        };
        var drawPath = function (ctx) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawCities(acoCanvas.getCtx());
            var coordsArray = cityConfig.coords;
            for (var i_1 = 1; i_1 < coordsArray.length + 1; i_1++) {
                canvas_arrow(ctx, coordsArray[walk[i_1 - 1]].x, coordsArray[walk[i_1 - 1]].y, coordsArray[walk[i_1]].x, coordsArray[walk[i_1]].y);
            }
            ctx.strokeStyle = '#17192A';
            ctx.stroke();
            ctx.fillStyle = "#393b5b";
            ctx.font = "14px Arial";
            ctx.fillText("Kokonaispituus: " + Math.round(length) +
                ", Kaupunkien määrä: " + cityConfig.amount + ", Iteraatiot: " + iterations, 10, 24);
        };
        drawPath(acoCanvas.getCtx());
    }
    var aco = new AcoAlgorithm(alpha, beta, q, iterations, pheromone);
    aco.init(JSON.parse(JSON.stringify(cityConfig.coords)));
    aco.setOnNewBest(onNewBest);
    aco.iterate();
});
(function () {
})();
