var context, // the audio context
    synth;   // synth object
var slider1 = document.getElementById('s1');
var slider2 = document.getElementById('s2');
var slider3 = document.getElementById('s3');
var slider4 = document.getElementById('s4');
var slider5 = document.getElementById('s5');
var slider6 = document.getElementById('s6');
var slider7 = document.getElementById('s7');
var slider8 = document.getElementById('s8');
var slider9 = document.getElementById('s9');
var slider10 = document.getElementById('s10');
    
synth = {
    gainNode: null,
    oscillator: null,
    currentKeyCode: null,
    wave: null,
    real: [],
    imag: [],
    init: function () {
        var real, imag, i, n = 100;
        this.gainNode = context.createGain();
        this.gainNode.gain.value = 0.1;
        this.gainNode.connect(context.destination);
        this.real = new Float32Array(n);
        this.imag = new Float32Array(n);
/*     
        // Without this section, the imaginary array gets populated
        // with values from the sliders when you move them.
        // Uncomment this section to start off with a square-like wave.
        for (i = 1; i < n; i += 2) {
            this.imag[i] = 1.0 / i;
        }
*/
        this.wave = context.createPeriodicWave(this.real, this.imag);
    },
    update: function (id, value) {
        this.imag[id.slice(1)] = value;
        this.wave = context.createPeriodicWave(this.real, this.imag);
    },
    playNote: function (freq) {
        this.oscillator = context.createOscillator();
        this.oscillator.frequency.value = freq;
        this.oscillator.setPeriodicWave(this.wave);
        this.oscillator.connect(this.gainNode);
        this.oscillator.start(0);
    },
    getFrequency: function (keyCode) {
        switch (keyCode) {
        case 65:
            return 233.082;
        case 83:
            return 246.942;
        case 68:
            return 277.183;
        case 70:
            return 311.127;
        case 71:
            return 329.628;
        case 72:
            return 369.994;
        case 74:
            return 415.305;
        case 75:
            return 466.164;
        case 76:
            return 493.883;
        case 186:
            return 554.365;
        case 222:
            return 622.254;
        default:
            return null;
        }
    },
    pressKey: function (keyCode) {
        var freq, i;
        // If you hold down a key, document.onkeydown gets called repeatedly
        // So if that happens, leave the function
        if (keyCode === this.currentKeyCode) {
            return;
        }
        freq = this.getFrequency(keyCode);
        if (freq) {
            if (this.currentKeyCode) {
                // Turn off the current note if one exists
                this.oscillator.stop(0);
            }
            this.currentKeyCode = keyCode;
            this.playNote(freq);
        }
    },
    liftKey: function (keyCode) {
        var i;
        if (keyCode === this.currentKeyCode) {
            this.oscillator.stop(0);
            this.currentKeyCode = null;
        }
    }
};

window.onload = function () {
    try {
        context = new AudioContext();
    } catch (e) {
        alert("No web audio support in this browser :(");
        return;
    }

    synth.init();

    document.onkeydown = function (event) {
        synth.pressKey(event.keyCode);
    };

    document.onkeyup = function (event) {
        synth.liftKey(event.keyCode);
    };
};