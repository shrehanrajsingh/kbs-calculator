let calchist = localStorage.getItem('chist');
let pcalhist = localStorage.getItem('phist');

const MODE_STANDARD = 0;
const MODE_PROGRAMMER = 1;
const MODE_GRAPHING = 2;

const NR_MODE_IEEE = 0;
const NR_MODE_BIGINT = 1;

let mode = MODE_STANDARD;
let nrmode = NR_MODE_IEEE;

let pCurrentBase = 10;

const setMode = m => {
    mode = m;

    document.querySelector('#calc-mode span').innerHTML = (
        mode == MODE_STANDARD ? 'Standard': (
            mode == MODE_PROGRAMMER ? 'Programmer': 'Graphing'
        )
    );
}

const calculate = (str, pushCH) => {
    if (pushCH === undefined) {
        calchist.push(str);
        localStorage.setItem('chist', JSON.stringify(calchist));
    }
    let last_str = str;

    do {
        let gb = 0;
        for (let i = 0; i < str.length; i++) {
            const iv = str[i];

            if (iv == '(' && !gb) {
                let gb2 = 0;
                let endidx = -1;

                for (let j = i + 1; j < str.length; j++) {
                    const jv = str[j];

                    if (jv == ')' && !gb2) {
                        endidx = j;
                        break;
                    }
                    
                    if (jv == '(') gb2++;
                    if (jv == ')') gb2--;
                }
                
                let rt = calculate(str.substr(i + 1, endidx - i - 1), false);
                // console.log(str.substr(i + 1, endidx - i - 1), rt);
                str = str.substr(0, i) + rt.toString() + str.substr(endidx + 1);
                // console.log(str);
            }
            
            if (iv == '(') gb++;
            if (iv == ')') gb--;
        }

        if (str[0] == '-') {
            str = '0' + str;
        }
    }
    while (str.includes('('));

    let toks = [];
    const precedence = {
        '+': 10,
        '-': 10,
        '*': 20,
        '/': 20,
        '%': 30 /* mod */
    };

    for (let i = 0; i < str.length; i++) {
        const iv = str[i];
        
        if (iv in precedence) {
            toks.push(iv);
            toks.push('');
        } else {
            if (toks.length) {
                toks[toks.length - 1] += iv;
            } else {
                toks.push(iv);
            }
        }
    }

    let nums = [];
    let ops = [];

    toks.forEach(e => {
        if (isNaN(e)) {
            while (ops.length && precedence[ops[ops.length - 1]] >= precedence[e]) {
                let b = nums.pop();
                let a = nums.pop();
                let op = ops.pop();
                let r = 0;

                switch (op) {
                    case '+':
                        r = a + b;
                        break;
                    case '-':
                        r = a - b;
                        break;
                    case '*':
                        r = a * b;
                        break;
                    case '/':
                        r = a / b;
                        break;
                    case '%':
                        r = a % b;
                        break;
                    default:
                        break;
                }

                nums.push(r);
            }
            ops.push(e);
        } else {
            nums.push(parseFloat(e));
        }
    });

    while (ops.length) {
        let b = nums.pop();
        let a = nums.pop();
        let op = ops.pop();
        let r = 0;

        switch (op) {
            case '+':
                r = a + b;
                break;
            case '-':
                r = a - b;
                break;
            case '*':
                r = a * b;
                break;
            case '/':
                r = a / b;
                break;
            case '%':
                r = a % b;
                break;
            default:
                break;
        }

        nums.push(r);
    }

    return nums[0];
}

const changeBase = (str, toBase) => {
    let decimal = parseInt(str, pCurrentBase);

    pCurrentBase = toBase;
    return decimal.toString(toBase);
};

const openMode = s => {
    const modestandard = document.querySelectorAll('.mode-standard');
    const modeprogrammer = document.querySelectorAll('.mode-programmer');
    const modegraphing = document.querySelectorAll('.mode-graphing');

    const [lb_mode, lb_nrmode, lb_settings] = document.querySelectorAll('.lbul');

    const lb_node_lis = lb_mode.querySelectorAll('li');
    const lb_nrmode_lis = lb_nrmode.querySelectorAll('li');
    const lb_settings_lis = lb_settings.querySelectorAll('li');

    lb_node_lis.forEach(e => {
        e.addEventListener('click', f => {
            if (f.innerHTML == 'Standard') {
                console.log(mode);
                
                setMode(MODE_STANDARD);
            } else if (f.innerHTML == 'Programmer') {
                setMode(MODE_PROGRAMMER);
            } else if (f.innerHTML == 'Graphing') {
                setMode(MODE_GRAPHING);
            }
        });
    });

    switch (s) {
        case MODE_STANDARD:
        {
            lb_node_lis[1].style.backgroundColor = 'rgb(46, 49, 63)';
            lb_node_lis[2].style.background = 'none';
            lb_node_lis[3].style.background = 'none';
            modestandard.forEach(e => {
                e.style.display = 'block';
            });

            modeprogrammer.forEach(e => {
                e.style.display = 'none';
            });

            modegraphing.forEach(e => {
                e.style.display = 'none';
            });

            const lmli = lb_mode.querySelectorAll('.li');
        }
            break;
        
        case MODE_PROGRAMMER:
        {
            lb_node_lis[2].style.backgroundColor = 'rgb(46, 49, 63)';
            lb_node_lis[1].style.background = 'none';
            lb_node_lis[3].style.background = 'none';
            modestandard.forEach(e => {
                e.style.display = 'none';
            });

            modeprogrammer.forEach(e => {
                e.style.display = 'block';
            });

            modegraphing.forEach(e => {
                e.style.display = 'none';
            });
        }
            break;
        
        case MODE_GRAPHING:
        {
            lb_node_lis[3].style.backgroundColor = 'rgb(46, 49, 63)';
            lb_node_lis[1].style.background = 'none';
            lb_node_lis[2].style.background = 'none';
            modestandard.forEach(e => {
                e.style.display = 'none';
            });

            modeprogrammer.forEach(e => {
                e.style.display = 'none';
            });

            modegraphing.forEach(e => {
                e.style.display = 'block';
            });
        }
            break;
    
        default:
            break;
    }
}

const addCalcHist = () => {
    const hist = document.getElementById('history');
    hist.innerHTML = '';

    calchist.forEach(ch => {
        hist.innerHTML += `
            <h3>${ch}</h3>
        `;
    });
}

const addPCalHist = () => {
    const phist = document.getElementById('p-history');
    phist.innerHTML = '';

    pcalhist.forEach(p => {
        phist.innerHTML += `
            <h3>${p}</h3>
        `;
    });
}

window.onload = () => {
    if (calchist === null){
        calchist = [];
        localStorage.setItem('chist', '[]');
    }
    else
        calchist = JSON.parse(calchist);
    
    if (pcalhist === null){
        pcalhist = [];
        localStorage.setItem('phist', '[]');
    }
    else
        pcalhist = JSON.parse(pcalhist);
    const btns = document.querySelectorAll('.btn');
    const result = document.getElementById('result');
    const hist = document.getElementById('history');

    const pbtns = document.querySelectorAll('.p-btn');
    const pres = document.getElementById('p-result');
    const phist = document.getElementById('p-history');

    addCalcHist();
    setMode(mode);
    openMode(mode);
    hist.scrollTop = hist.scrollHeight;

    btns.forEach(v => {
        v.addEventListener('click', e => {
            e.preventDefault();
            let ihtml = e.target.innerHTML;

            if ('0123456789+-*/.'.includes(ihtml)) {
                result.value += ihtml;
            }

            if (ihtml == 'mod') {
                result.value += '%';
            }

            if (ihtml == 'AC') {
                result.value = '';
            }

            if (ihtml == 'C') {
                result.value = result.value.substr(0, result.value.length - 1);
            }

            if (ihtml == '=') {
                result.value = calculate(result.value);
                hist.innerHTML += `
                    <h3>${calchist[calchist.length - 1]}</h3>
                `;
                hist.scrollTop = hist.scrollHeight;
            }

            if (ihtml == '+/-') {
                result.value = `(-(${result.value}))`
            }
        });
    });

    pbtns.forEach(v => {
        v.addEventListener('click', e => {
            e.preventDefault();
            let ihtml = e.target.innerHTML;

            if ('0123456789abcdefABCDEF<>&|^'.includes(ihtml)) {
                pres.value += ihtml;
            }

            if (ihtml == 'AC') {
                pres.value = '';
            }

            if (ihtml == 'C') {
                pres.value = pres.value.substr(0, pres.value.length - 1);
            }

            if (ihtml == 'HEX') {
                pres.value = changeBase(pres.value, 16);
            }

            if (ihtml == 'DEC') {
                pres.value = changeBase(pres.value, 10);
            }

            if (ihtml == 'OCT') {
                pres.value = changeBase(pres.value, 8);
            }

            if (ihtml == 'BIN') {
                pres.value = changeBase(pres.value, 2);
            }

            if (ihtml == '=') {
                // pres.value = calculate(pres.value);
                // hist.innerHTML += `
                //     <h3>${calchist[calchist.length - 1]}</h3>
                // `;
                // hist.scrollTop = hist.scrollHeight;
            }
        });
    });

    document.addEventListener('keydown', e => {
        const key = e.key;

        if (mode == MODE_STANDARD) {
            if ('0123456789+-*/.()'.includes(key)) {
                result.value += key;
            }
            if (key === 'Enter') {
                result.value = calculate(result.value);
                hist.innerHTML += `<h3>${calchist[calchist.length - 1]}</h3>`;
                hist.scrollTop = hist.scrollHeight;
            }
            if (key === 'Backspace') {
                result.value = result.value.substr(0, result.value.length - 1);
            }
            if (key === 'Escape') {
                result.value = '';
            }
        } else if (mode == MODE_PROGRAMMER) {
            if ('0123456789abcdefABCDEF<>&|^'.includes(key)) {
                pres.value += key;
            }
            if (key === 'Enter') {
                pres.value = calculate(pres.value);
                phist.innerHTML += `<h3>${calchist[calchist.length - 1]}</h3>`;
                phist.scrollTop = phist.scrollHeight;
            }
            if (key === 'Backspace') {
                pres.value = pres.value.substr(0, pres.value.length - 1);
            }
            if (key === 'Escape') {
                pres.value = '';
            }
        }
    });

    const [lb_mode, lb_nrmode, lb_settings] = document.querySelectorAll('.lbul');

    const lb_node_lis = lb_mode.querySelectorAll('li');
    const lb_nrmode_lis = lb_nrmode.querySelectorAll('li');
    const lb_settings_lis = lb_settings.querySelectorAll('li');

    lb_node_lis.forEach(e => {
        e.onclick = f => {
            let ele = f.target;
            
            if (ele.innerHTML == 'Standard') {
                setMode(MODE_STANDARD);
            } else if (ele.innerHTML == 'Programmer') {
                setMode(MODE_PROGRAMMER);
            } else if (ele.innerHTML == 'Graphing') {
                setMode(MODE_GRAPHING);
            }

            openMode(mode);
        };
    });

    lb_settings_lis.forEach(e => {
        e.onclick = f => {
            let ele = f.target;

            if (ele.innerHTML == 'Clear history') {
                calchist = [];
                localStorage.setItem('chist', JSON.stringify(calchist));
                addCalcHist();
            }
        };
    });
};