"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();


//const zip = (a, b) => a.map((k, i) => [k, b[i]]);

/*
function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}*/
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}

var _vtos;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _pj;
var COLS, DL, DR, H, MAX_VALUE, MID, MIN_VALUE, POST, PRE, ROWS, RUNM1, RUNP1, START, V, WIN_VALUE, b, c, cheapen_ours, debug, debug_count_sc_cost, debug_options, dir, last_d, moves, stov, trace_d, trace_value, vtos, who, x;
function _pj_snippets(container) {
    function _assert(comp, msg) {
        function PJAssertionError(message) {
            this.name = "PJAssertionError";
            this.message = message || "Custom error PJAssertionError";
            if (typeof Error.captureStackTrace === "function") {
                Error.captureStackTrace(this, this.constructor);
            } else {
                this.stack = new Error(message).stack;
            }
        }
        PJAssertionError.prototype = Object.create(Error.prototype);
        PJAssertionError.prototype.constructor = PJAssertionError;
        msg = msg || "Assertion failed.";
        if (!comp) {
            throw new PJAssertionError(msg);
        }
    }
    container["_assert"] = _assert;
    return container;
}
_pj = {};
_pj_snippets(_pj);
/*
Captain's Mistress

next:
try js version with UI on watch

test more refined distance to floor: 0..N*/
debug = true;
debug_options = false;
debug_count_sc_cost = 0;
cheapen_ours = true;
ROWS = 6;
COLS = 7;
H = 1;
V = COLS;
DL = COLS - 1;
DR = COLS + 1;
MAX_VALUE = 99999999;
MIN_VALUE = -MAX_VALUE;
WIN_VALUE = MAX_VALUE * 0.5;
dir = [H, V, DL, DR];
moves = new Array();
trace_value = new Array(); //[0] * COLS;
for (var col = 0; col <= COLS; col++) {
    trace_value.push(0);
}
last_d = {};
trace_d = {};
vtos = (_vtos = {}, _defineProperty(_vtos, -1, "O"), _defineProperty(_vtos, 0, "\xB7"), _defineProperty(_vtos, 1, "X"), _vtos);
stov = { "O": -1, "\xB7": 0, "X": 1 };
START = 0;
PRE = 1;
RUNM1 = 2;
RUNP1 = 3;
MID = 4;
POST = 5;
/*
function range(size, startAt = 0) {
return [...Array(size).keys()].map(i => i + startAt);
}

reversed -> .reverse()*/
function new_board() {
    var res;
    res = new Array();
    for (var r = 0, _pj_a = ROWS; r < _pj_a; r += 1) {
        for (var c = 0, _pj_b = COLS; c < _pj_b; c += 1) {
            res.push(0);
        }
    }
    return res;
}
function print_board(b) {
    var p, s, v;
    for (var r, _pj_c = 0, _pj_a = (range(ROWS).reverse()), _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
        r = _pj_a[_pj_c];
        s = "";
        for (var c = 0, _pj_d = COLS; c < _pj_d; c += 1) {
            p = c + r * COLS + 1;
            v = get_p(b, p);
            s = s + vtos[v];
        }
        //console.log(s);
    }
    //console.log("---");
}
function unproject_board(s) {
    /* debug */
    var l, res, ss;
    ss = s.strip().splitlines();
    res = new Array();
    for (var r, _pj_c = 0, _pj_a = reversed(ss), _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
        r = _pj_a[_pj_c];
        l = r.strip();
        for (var c, _pj_f = 0, _pj_d = l, _pj_e = _pj_d.length; _pj_f < _pj_e; _pj_f += 1) {
            c = _pj_d[_pj_f];
            res.push(stov[c]);
        }
    }
    return res;
}
function get_p(b, p) {
    _pj._assert(p >= 0 && p <= ROWS * COLS, "Out of range ");
    return b[p - 1];
}
function set_p(b, p, who) {
    _pj._assert(p > 0 && p <= ROWS * COLS, "Out of range ");
    b[p - 1] = who;
}
function get_next(b, p, dir) {
    if (p + dir > ROWS * COLS) {
        return null;
    }
    if (p + dir < 1) {
        return null;
    }
    return get_p(b, p + dir);
}
function move(b, col, who) {
    var p, r, v;
    r = 0;
    p = col;
    while (r < ROWS) {
        v = get_p(b, p);
        if (v === 0) {
            set_p(b, p, who);
            moves.push([col, who]);
            return r;
        }
        p = p + V;
        r += 1;
    }
    return null;
}
function unmove(b) {
    /*
    debug
     note: makes trace_value/trace_d invalid: assumes caller will call value_board
    */
    var col, move, p, r, v;
    move = moves.pop();
    r = ROWS - 1;
    col = move[0];
    p = col + r * COLS;
    while (r > -1) {
        v = get_p(b, p);
        if (v !== 0) {
            set_p(b, p, 0);
            r = null;
            break;
        }
        p = p - V;
        r -= 1;
    }
    return r;
}
function sc_cost(sc, who) {
    var cost, run;
    debug_count_sc_cost = debug_count_sc_cost + 1;
    cost = 0;
    _pj._assert(sc[RUNM1] === 0 || sc[RUNP1] === 0, "Both M1 and P1 have counts");
    run = sc[RUNM1] + sc[RUNP1];
    c = 0;
    if (run > 0) {
        if (run + sc[PRE] + sc[MID] + sc[POST] > 3) {
            c = 10;
            if (sc[PRE] === sc[MID]) {
                c = c * 7;
            }
        }
        if (run > 1 && run + sc[PRE] + sc[MID] + sc[POST] > 3) {
            c = 100;
        }
        if (run > 1 && sc[PRE] + sc[MID] + sc[POST] > 2) {
            c = 200;
            if (sc[PRE] > 1.4 && sc[POST] > 1.4 || sc[PRE] > 1.4 && sc[MID] > 1.4) {
                c = c * 10;
            }
        }
        if (run > 2 && (sc[PRE] > 0 || sc[MID] > 0 || sc[POST] > 0)) {
            c = 10000;
            if (sc[PRE] > 1 && sc[POST] > 1) {
                c = c * 10;
            }
            if (!(sc[RUNM1] > 0 && who === -1) || sc[RUNP1] > 0 && who === 1) {
                c = c / 10;
            }
        }
        if (run > 3 && sc[MID] === 0) {
            c = MAX_VALUE;
        }
    }
    if (sc[RUNM1] > 0) {
        c = c * -1;
    }
    if (cheapen_ours) {
        if (sc[RUNM1] > 0 && who === -1 || sc[RUNP1] > 0 && who === 1) {
            c = c * 0.999;
        }
    }
    cost += c;
    return [[0, 0, 0, 0, 0, 0], cost];
}
function get_floor(b, p, d) {
    var fp, res;
    res = 1;
    if (d !== V) {
        fp = p + d;
        while (get_next(b, fp, -V) === 0) {
            res = res / 2;
            fp = fp + d;
        }
    }
    return res;
}
function next_state(state, b, p, d, sc, cost, who) {
    var tc, this_cost, v;
    v = get_next(b, p, d);
    if (state === START) {
        if (v === 0) {
            state = PRE;
            sc[state] += get_floor(b, p, d);
        } else {
            if (v === -1) {
                state = RUNM1;
                sc[state] += 1;
            } else {
                if (v === 1) {
                    state = RUNP1;
                    sc[state] += 1;
                }
            }
        }
    } else {
        if (state === PRE) {
            if (v === 0) {
                sc[state] += get_floor(b, p, d);
            } else {
                if (v === -1) {
                    state = RUNM1;
                    sc[state] += 1;
                } else {
                    if (v === 1) {
                        state = RUNP1;
                        sc[state] += 1;
                    }
                }
            }
        } else {
            if (state === RUNM1) {
                if (sc[state] + sc[MID] > 3) {
                    var _sc_cost = sc_cost(sc, who);

                    var _sc_cost2 = _slicedToArray(_sc_cost, 2);

                    sc = _sc_cost2[0];
                    this_cost = _sc_cost2[1];

                    cost += this_cost;
                    state = START;
                }
                if (v === 0) {
                    if (sc[MID] === 0 && sc[state] < 3) {
                        state = MID;
                        if (false) {} else {
                            sc[state] += 1;
                        }
                    } else {
                        state = POST;
                        sc[state] += 1;
                    }
                } else {
                    if (v === -1) {
                        if (sc[state] > 2 && sc[PRE] > 0) {
                            sc[state] += 1;
                            state = POST;
                        } else {
                            sc[state] += 1;
                        }
                    } else {
                        if (v === 1) {
                            var _sc_cost3 = sc_cost(sc, who);

                            var _sc_cost4 = _slicedToArray(_sc_cost3, 2);

                            sc = _sc_cost4[0];
                            this_cost = _sc_cost4[1];

                            cost += this_cost;
                            state = RUNP1;
                            sc[state] += 1;
                        }
                    }
                }
            } else {
                if (state === RUNP1) {
                    if (sc[state] + sc[MID] > 3) {
                        var _sc_cost5 = sc_cost(sc, who);

                        var _sc_cost6 = _slicedToArray(_sc_cost5, 2);

                        sc = _sc_cost6[0];
                        this_cost = _sc_cost6[1];

                        cost += this_cost;
                        state = START;
                    }
                    if (v === 0) {
                        if (sc[MID] === 0 && sc[state] < 3) {
                            state = MID;
                            if (false) {} else {
                                sc[state] += 1;
                            }
                        } else {
                            state = POST;
                            sc[state] += 1;
                        }
                    } else {
                        if (v === 1) {
                            if (sc[state] > 2 && sc[PRE] > 0) {
                                sc[state] += 1;
                                state = POST;
                            } else {
                                sc[state] += 1;
                            }
                        } else {
                            if (v === -1) {
                                var _sc_cost7 = sc_cost(sc, who);

                                var _sc_cost8 = _slicedToArray(_sc_cost7, 2);

                                sc = _sc_cost8[0];
                                this_cost = _sc_cost8[1];

                                cost += this_cost;
                                state = RUNM1;
                                sc[state] += 1;
                            }
                        }
                    }
                } else {
                    if (state === MID) {
                        if (sc[MID] + sc[RUNM1] + sc[RUNP1] > 3) {
                            _pj._assert(sc[RUNM1] === 0 || sc[RUNP1] === 0, "Multiple counts");
                        }
                        if (v === 0) {
                            sc[state] += get_floor(b, p, d);
                        } else {
                            if (v === -1 || v === 1) {
                                if (sc[RUNM1] > 0 && v === -1) {
                                    state = RUNM1;
                                    sc[state] += 1;
                                } else {
                                    if (sc[RUNP1] > 0 && v === 1) {
                                        state = RUNP1;
                                        sc[state] += 1;
                                    } else {
                                        if (sc[RUNM1] > 0 && v === 1) {
                                            tc = sc[MID];

                                            var _sc_cost9 = sc_cost(sc, who);

                                            var _sc_cost10 = _slicedToArray(_sc_cost9, 2);

                                            sc = _sc_cost10[0];
                                            this_cost = _sc_cost10[1];

                                            cost += this_cost;
                                            sc[PRE] = tc;
                                            state = RUNP1;
                                            sc[state] += 1;
                                        } else {
                                            if (sc[RUNP1] > 0 && v === -1) {
                                                tc = sc[MID];

                                                var _sc_cost11 = sc_cost(sc, who);

                                                var _sc_cost12 = _slicedToArray(_sc_cost11, 2);

                                                sc = _sc_cost12[0];
                                                this_cost = _sc_cost12[1];

                                                cost += this_cost;
                                                sc[PRE] = tc;
                                                state = RUNM1;
                                                sc[state] += 1;
                                            } else {
                                                _pj._assert("New value after mid with no prior value?", null);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (state === POST) {
                            if (v === 0) {
                                sc[state] += get_floor(b, p, d);
                            } else {
                                if (v === -1) {
                                    tc = sc[POST];

                                    var _sc_cost13 = sc_cost(sc, who);

                                    var _sc_cost14 = _slicedToArray(_sc_cost13, 2);

                                    sc = _sc_cost14[0];
                                    this_cost = _sc_cost14[1];

                                    cost += this_cost;
                                    sc[PRE] = tc;
                                    state = RUNM1;
                                    sc[state] += 1;
                                } else {
                                    if (v === 1) {
                                        tc = sc[POST];

                                        var _sc_cost15 = sc_cost(sc, who);

                                        var _sc_cost16 = _slicedToArray(_sc_cost15, 2);

                                        sc = _sc_cost16[0];
                                        this_cost = _sc_cost16[1];

                                        cost += this_cost;
                                        sc[PRE] = tc;
                                        state = RUNP1;
                                        sc[state] += 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return [state, sc, cost];
}
function value_d(b, who, d, run) {
    var cost, l, p, r, sc, state, this_cost, v;
    cost = 0;
    done_dir = false;
    for (var rl, _pj_c = 0, _pj_a = run, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
        rl = _pj_a[_pj_c];
        var _ref = [rl[0], rl[1]];
        r = _ref[0];
        l = _ref[1];

        p = r - d;
        sc = [0, 0, 0, 0, 0, 0];
        state = START;
        for (var c = 0, _pj_d = l; c < _pj_d; c += 1) {
            v = get_next(b, p, d);
            if (d !== H && v === 0 && sc[RUNM1] + sc[RUNP1] + sc[MID] > 3) {
                break;
            }
            if (d === H && v === 0 && sc[PRE]>l-1) {  
                done_dir = True
            }

            var _next_state = next_state(state, b, p, d, sc, cost, who);

            var _next_state2 = _slicedToArray(_next_state, 3);

            state = _next_state2[0];
            sc = _next_state2[1];
            cost = _next_state2[2];

            p += d;
        }

        var _sc_cost17 = sc_cost(sc, who);

        var _sc_cost18 = _slicedToArray(_sc_cost17, 2);

        sc = _sc_cost18[0];
        this_cost = _sc_cost18[1];

        cost += this_cost;

        if (done_dir) {
            break;
        }
    }
    return cost;
}
function value_board(b, who) {
    var cost, tcost;
    tcost = 0;
    cost = value_d(b, who, H, [[1,COLS],[1*COLS+1,COLS],[2*COLS+1,COLS],[3*COLS+1,COLS],[4*COLS+1,COLS],[5*COLS+1,COLS]]);
    last_d[H] = cost;
    tcost += cost;
    cost = value_d(b, who, V, [[1,ROWS], [2,ROWS], [3,ROWS], [4,ROWS], [5,ROWS], [6,ROWS], [7,ROWS]]);
    last_d[V] = cost;
    tcost += cost;
    cost = value_d(b, who, DR, [[15, 4], [8, 5], [1, 6], [2, 6], [3, 5], [4, 4]]);
    last_d[DR] = cost;
    tcost += cost;
    cost = value_d(b, who, DL, [[20, 4], [14, 5], [7, 6], [6, 6], [5, 5], [4, 4]]);
    last_d[DL] = cost;
    tcost += cost;
    return tcost;
}
function computer_play(b, who) {
    var b2, best, bestcol, cur, push_moves, can;
    cur = value_board(b, who);
    best = cur;
    bestcol = null;
    push_moves = moves.slice();
    for (var col = 0, _pj_a = COLS; col < _pj_a; col += 1) {
        b2 = b.slice();
        can = move(b2, col + 1, who);
        if (can !== null && bestcol == null) {
            bestcol = col
        }
        if (can !== null) {
            x = value_board(b2, who);
            if (debug_options) {
                //print_board(b2);
                //console.log("case", col + 1, x);
            }
            trace_value[col] = x;
            if (who > 0 && x > best || who < 0 && x < best) {
                best = x;
                bestcol = col + 1;
                //trace_d = last_d.copy();
            }
        }
    }
    if (best !== cur) {
        //console.log("best", bestcol, best, "was", cur);
    } else {
        //console.log("1");
    }
    moves = push_moves.slice();
    return bestcol;
}
//# sourceMappingURL=connect4.js.map


/////////////////////////// Bangle ////////////////

function render_board(b, offx, offy, who, whoc) {
    var p,v;
    g.setColor(0,0,1);
    g.fillRect(1,offy,176,176)
    for (var r = 0; r < ROWS; r += 1) {
        for (var c = 0; c < COLS; c += 1) {
            p = c + r * COLS + 1;
            v = get_p(b, p);
            //g.drawCircleAA(c*4, r*4, 4);
            if (v === -1) {
              g.setColor(1,0,0);
            } else if (v === 1) {
              g.setColor(1,1,0);
            } else {
              g.setColor(0.4,0.4,0.4);
            }
            g.fillCircle(offx+c*24, (176-offy/2)-r*24, 8);
            g.setColor(0,0,0);
            g.drawCircle(offx+c*24, (176-offy/2)-r*24, 9);
        }
    }

    g.setColor(1,1,1);
    if (who === -1) {
      //print(whoc);
      g.drawRect(offx+whoc*24-16, offy+1, offx+whoc*24+16, 176-2);
    }
}


function replay() {
  E.showPrompt("Play again?").then(function(v) {
    if (v) {
      //print("'Yes' chosen");
      b = new_board();
      who = -1;
      whoc = 3;
      render_board(b, 16, 28, who, whoc);
    } else {
      //print("'No' chosen");
      //todo exit
      reset();
    }
});  
}



// place your const, vars, functions or classes here
function play() {
    console.log("Play");
    b = new_board();
    who = -1;
    whoc = 3;
    render_board(b, 16, 28, who, whoc);
  
    var offx = 16;

    Bangle.on('swipe', function(direction) { 
      console.log(direction); 
      whoc = whoc + direction;
      whoc = (whoc % COLS);
      render_board(b, offx, 28, who, whoc);
      //g.flip();
    });    

    Bangle.on('touch', function(zone, e) { 
      //console.log(e); 
      c = Math.floor((e.x+offx) / 24);
      //console.log(c); 
      if (who === -1 && c>0 && c < COLS+1) {
        whoc = c-1;
        render_board(b, offx, 28, who, whoc);
      }
    });

    setWatch(function() {
      console.log("Pressed");
      if (who === -1) {
        move(b, whoc+1, who);
        render_board(b, offx, 28, who*-1, whoc);
        g.flip();
        //print_board(b);
        
        x=value_board(b, who);
        if (Math.abs(x) > WIN_VALUE) {
            console.log("won!");
            E.showPrompt("You won", {title: "", buttons: {"Ok":true}}).then(function(v) {
              //break;
              who = 0;
              //todo check board full?
              replay();
            });
        } else 
          who = who * -1;

        if (who === 1) {
          c = computer_play(b, who);
          move(b, parseInt(c), who);
          render_board(b, offx, 28, who*-1, whoc);
          //print_board(b);

          x=value_board(b, who);
          if (Math.abs(x) > WIN_VALUE) {
              console.log("won!");
              E.showPrompt("Computer won", {title: "", buttons: {"Ok":true}}).then(function(v) {
                //break;
                who = 0;
                //todo check board full?
                replay();
              });
          } else 
            who = who * -1;
        } 
      }
    }, BTN, {edge:"rising", debounce:50, repeat:true});
  
}


// special function to handle display switch on
Bangle.on('lcdPower', (on) => {
  if (on) {
    // call your app function here
    play();
    // If you clear the screen, do Bangle.drawWidgets();
  }
});

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
play();
