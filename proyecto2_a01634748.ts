// Hecho por Joel Santillan A01634748
// Algoritmo sacado del libro "Data structures & Algorithms in Java" por Robert Lafore
const fs = require('fs');

const cadena = '3 * ( 6 + 2 ) - 4';
const derivacion = [];
let textoDelArchivo;
let arbolDeExpresion;
let nodo = {
    valor: null,
    izq: null,
    der: null,
};
const arrNodos = [];

const evaluaExpresion = () => {
    const pila = [];
    const expresionPostfija = expresionPostfijo();
    const tokens = expresionPostfija.split(' ');
    // tslint:disable-next-line: one-variable-per-declaration
    let op1, op2, current, res;
    for (const t of tokens) {
        switch (t) {
            default:
                pila.push(t);
                break;
            case '+':
                op2 = parseFloat(pila.pop());
                op1 = parseFloat(pila.pop());
                current = op1 + op2;
                pila.push(current.toString());
                break;
            case '-':
                op2 = parseFloat(pila.pop());
                op1 = parseFloat(pila.pop());
                current = op1 - op2;
                pila.push(current.toString());
                break;
            case '*':
                op2 = parseFloat(pila.pop());
                op1 = parseFloat(pila.pop());
                current = op1 * op2;
                pila.push(current.toString());
                break;
            case '/':
                op2 = parseFloat(pila.pop());
                op1 = parseFloat(pila.pop());
                current = op1 / op2;
                pila.push(current.toString());
                break;
        }
    }
    res = parseFloat(pila.pop());
    return res;

};

const expresionPostfijo = () => {
    const pila = [];
    const tokens = cadena.split(' ');
    let pop = '';
    let expresionPostfija = '';

    for (const t of tokens) {
        let bandera = false;
        switch (t) {
            default:
                expresionPostfija += t + ' ';
                break;
            case '(':
                pila.push(t);
                break;
            case ')':
                while (isEmpty(pila) === false && bandera !== true){
                    pop = pila.pop();
                    if (pop !== '('){
                        expresionPostfija += pop + ' ';
                    }else {
                        bandera = true;
                    }
                }
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                if (isEmpty(pila) === true){
                    pila.push(t);
                    break;
                }else {
                    while (isEmpty(pila) === false && bandera !== true){
                        pop = pila.pop();
                        switch (pop) {
                            case '(':
                                pila.push(pop);
                                bandera = true;
                                break;
                            case '+':
                            case '-':
                            case '*':
                            case '/':
                                if (precedencia(pop, t) === true){
                                    pila.push(pop);
                                }else {
                                    expresionPostfija += pop + ' ';
                                }
                                break;
                        }
                    }
                    pila.push(t);
                }
        }
    }

    while (isEmpty(pila) === false){
        pop = pila.pop();
        if (pila.length === 0){
            expresionPostfija += pop;
        }else {

            expresionPostfija += pop + ' ';
        }
    }
    graphviz(expresionPostfija);
    return expresionPostfija;
};

const precedencia = (opTop, opThis) => {
    if (opTop === '+' && opThis === '*'){
        return true;
    }else if (opTop === '+' && opThis === '/'){
        return true;
    }else if (opTop === '-' && opThis === '*'){
        return true;
    }else if (opTop === '-' && opThis === '/'){
        return true;
    }else if (opTop === '+' && opThis === '^'){
        return true;
    }else if (opTop === '-' && opThis === '^'){
        return true;
    }else if (opTop === '*' && opThis === '^'){
        return true;
    }else if (opTop === '/' && opThis === '^'){
        return true;
    }else {
        return false;
    }
};

const operando = (str) => {
    try {
        parseFloat(str);
        return true;
    }catch (err){
        return false;
    }
};

const isEmpty = (stack) => {
    return stack.length === 0;
};

const graphviz = (palabra) => {
    const stack = [];
    palabra.split(' ').forEach((x, i) => {
        if (!esOperador(x)){
            const node = {
                val: `Nodo${i}`,
                label: `Nodo${i}[label="${x}"]`,
                izq: null,
                der: null,
            };
            stack.push(node);
        }else {
            const op1 = stack.pop();
            const op2 = stack.pop();
            const node = {
                val: `Nodo${i}`,
                label: `Nodo${i}[label="${x}"]`,
                izq: op1,
                der: op2,
            };
            stack.push(node);
        }
    });

    arbolDeExpresion = stack.pop();
    console.log(arbolDeExpresion);
};

const esOperador = (str) => {
    return str === '+' || str === '-' || str === '*' || str === '/';
};

const generarGrafo = (raiz) => {
    if (raiz.val){
        arrNodos.push(raiz.label);
        if (raiz.izq){
            derivacion.push(`${raiz.val} -> ${raiz.izq.val}`);
            generarGrafo(raiz.izq);
        }
        if (raiz.der){
            derivacion.push(`${raiz.val} -> ${raiz.der.val}`);
            generarGrafo(raiz.der);
        }
    }

};

const crearArchivo = (txt) => {
    fs.writeFile('derivada.txt', txt, (err) => {
        if (err) {
          console.log(err);
        }
      });
};

if (evaluaExpresion()){
    console.log('La cadena SI puede ser generada por la gramática');
    generarGrafo(arbolDeExpresion);
    textoDelArchivo = `digraph G {
        ${arrNodos.join(';')};
        ${derivacion.join(';')};
    }`;
    crearArchivo(textoDelArchivo);
}else {
    console.log('La cadena NO puede ser generada por la gramática');
}
