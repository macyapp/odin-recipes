const container = document.getElementById('bars-container');
let isSortingPaused = false;
let isSortingStopped = false;
let currentSortFunction = null;

function generateRandomArray() {
    const arraySizeInput = document.getElementById('arraySize');
    const arraySize = parseInt(arraySizeInput.value);

    const arrayElementsInput = document.getElementById('arrayElements');
    const elements = arrayElementsInput.value
        .split(',')
        .map((element) => parseInt(element.trim()))
        .filter((element) => !isNaN(element));

    if (elements.length < arraySize) {
        const remainingElements = arraySize - elements.length;
        for (let i = 0; i < remainingElements; i++) {
            const randomElement = Math.floor(Math.random() * 100) + 1;
            elements.push(randomElement);
        }
    } else if (elements.length > arraySize) {
        elements.length = arraySize;
    }

    container.innerHTML = '';
    for (const element of elements) {
        const bar = document.createElement('div');
        bar.style.height = `${element * 4}px`;
        bar.className = 'bar';
        container.appendChild(bar);
    }
}

function startSorting() {
    if (currentSortFunction) {
        stopSorting();
    }

    const sortingAlgorithmSelect = document.getElementById('sortingAlgorithm');
    const selectedAlgorithm = sortingAlgorithmSelect.value;
    const sortingFunction = getSortingFunction(selectedAlgorithm);

    if (sortingFunction) {
        isSortingPaused = false;
        isSortingStopped = false;
        sortingFunction();
    }
}

function getSortingFunction(selectedAlgorithm) {
    switch (selectedAlgorithm) {
        case 'bubbleSort':
            return bubbleSort;
        case 'selectionSort':
            return selectionSort;
        case 'insertionSort':
            return insertionSort;
        case 'quickSortLomuto':
            return quickSortLomuto;
        case 'quickSortHoare':
            return quickSortHoare;
        case 'heapSort':
            return heapSort;
        case 'countingSort':
            return countingSort;
        case 'radixSort':
            return radixSort;
        case 'bucketSort':
            return bucketSort;
        default:
            return null;
    }
}

function stopSorting() {
    isSortingStopped = true;
    currentSortFunction = null;
}

function pauseSorting() {
    isSortingPaused = true;
}

async function resumeSorting() {
    isSortingPaused = false;
    if (currentSortFunction) {
        await currentSortFunction();
    }
}

async function bubbleSort() {
    setCurrentSortFunction(bubbleSort);

    const bars = container.children;
    for (let i = 0; i < bars.length - 1; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            if (isSortingStopped) {
                return;
            }

            const bar1 = bars[j];
            const bar2 = bars[j + 1];
            bar1.style.backgroundColor = 'red';
            bar2.style.backgroundColor = 'red';

            await new Promise((resolve) => setTimeout(resolve, 20));

            const height1 = parseInt(bar1.style.height);
            const height2 = parseInt(bar2.style.height);

            if (height1 > height2) {
                bar1.style.height = `${height2}px`;
                bar2.style.height = `${height1}px`;
            }

            bar1.style.backgroundColor = '#007bff';
            bar2.style.backgroundColor = '#007bff';

            if (isSortingPaused) {
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (!isSortingPaused) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                });
            }
        }
    }
}

async function selectionSort() {
    setCurrentSortFunction(selectionSort);

    const bars = container.children;
    for (let i = 0; i < bars.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < bars.length; j++) {
            if (isSortingStopped) {
                return;
            }

            const bar1 = bars[j];
            bar1.style.backgroundColor = 'red';

            await new Promise((resolve) => setTimeout(resolve, 20));

            const height1 = parseInt(bar1.style.height);
            const height2 = parseInt(bars[minIndex].style.height);

            if (height1 < height2) {
                minIndex = j;
            }

            bar1.style.backgroundColor = '#007bff';

            if (isSortingPaused) {
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (!isSortingPaused) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                });
            }
        }

        if (minIndex !== i) {
            const bar1 = bars[i];
            const bar2 = bars[minIndex];
            const tempHeight = bar1.style.height;
            bar1.style.height = bar2.style.height;
            bar2.style.height = tempHeight;
        }
    }
}

async function insertionSort() {
    setCurrentSortFunction(insertionSort);

    const bars = container.children;
    for (let i = 1; i < bars.length; i++) {
        const currentBar = bars[i];
        currentBar.style.backgroundColor = 'red';

        await new Promise((resolve) => setTimeout(resolve, 20));

        const currentHeight = parseInt(currentBar.style.height);
        let j = i - 1;

        while (j >= 0 && parseInt(bars[j].style.height) > currentHeight) {
            if (isSortingStopped) {
                return;
            }

            const bar1 = bars[j];
            const bar2 = bars[j + 1];
            bar1.style.backgroundColor = 'red';
            bar2.style.backgroundColor = 'red';

            await new Promise((resolve) => setTimeout(resolve, 20));

            const tempHeight = bar1.style.height;
            bar1.style.height = bar2.style.height;
            bar2.style.height = tempHeight;

            bar1.style.backgroundColor = '#007bff';
            bar2.style.backgroundColor = '#007bff';

            j--;

            if (isSortingPaused) {
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (!isSortingPaused) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                });
            }
        }

        currentBar.style.backgroundColor = '#007bff';
    }
}

async function quickSortLomuto(left = 0, right = container.children.length - 1) {
    setCurrentSortFunction(quickSortLomuto);

    if (left < right) {
        const pivotIndex = await partitionLomuto(left, right);
        if (isSortingStopped) {
            return;
        }
        await quickSortLomuto(left, pivotIndex - 1);
        await quickSortLomuto(pivotIndex + 1, right);
    }
}

async function partitionLomuto(left, right) {
    const bars = container.children;
    const pivot = parseInt(bars[right].style.height);
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (isSortingStopped) {
            return;
        }

        const bar1 = bars[j];
        const bar2 = bars[right];
        bar1.style.backgroundColor = 'red';
        bar2.style.backgroundColor = 'red';

        await new Promise((resolve) => setTimeout(resolve, 50));

        const barHeight = parseInt(bar1.style.height);

        if (barHeight < pivot) {
            i++;
            const barI = bars[i];
            const tempHeight = barI.style.height;
            barI.style.height = bar1.style.height;
            bar1.style.height = tempHeight;
        }

        bar1.style.backgroundColor = '#007bff';
        bar2.style.backgroundColor = '#007bff';

        if (isSortingPaused) {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (!isSortingPaused) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }

    const barIPlus1 = bars[i + 1];
    const barRight = bars[right];
    const tempHeight = barIPlus1.style.height;
    barIPlus1.style.height = barRight.style.height;
    barRight.style.height = tempHeight;

    barRight.style.backgroundColor = 'green';
    await new Promise((resolve) => setTimeout(resolve, 100));
    barRight.style.backgroundColor = '#007bff';

    return i + 1;
}

async function quickSortHoare(left = 0, right = container.children.length - 1) {
    setCurrentSortFunction(quickSortHoare);

    if (left < right) {
        const pivotIndex = await partitionHoare(left, right);
        if (isSortingStopped) {
            return;
        }
        await quickSortHoare(left, pivotIndex);
        await quickSortHoare(pivotIndex + 1, right);
    }
}

async function partitionHoare(left, right) {
    const bars = container.children;
    const pivot = parseInt(bars[Math.floor((left + right) / 2)].style.height);
    let i = left - 1;
    let j = right + 1;

    while (true) {
        do {
            i++;
        } while (parseInt(bars[i].style.height) < pivot);

        do {
            j--;
        } while (parseInt(bars[j].style.height) > pivot);

        if (i >= j) {
            return j;
        }

        if (isSortingStopped) {
            return;
        }

        const barI = bars[i];
        const barJ = bars[j];
        barI.style.backgroundColor = 'red';
        barJ.style.backgroundColor = 'red';

        await new Promise((resolve) => setTimeout(resolve, 50));

        const tempHeight = barI.style.height;
        barI.style.height = barJ.style.height;
        barJ.style.height = tempHeight;

        barI.style.backgroundColor = '#007bff';
        barJ.style.backgroundColor = '#007bff';

        if (isSortingPaused) {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (!isSortingPaused) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }
}

async function heapSort() {
    setCurrentSortFunction(heapSort);

    const bars = container.children;
    const n = bars.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i >= 0; i--) {
        if (isSortingStopped) {
            return;
        }

        const bar0 = bars[0];
        const barI = bars[i];
        bar0.style.backgroundColor = 'red';
        barI.style.backgroundColor = 'red';

        await new Promise((resolve) => setTimeout(resolve, 50));

        const tempHeight = bar0.style.height;
        bar0.style.height = barI.style.height;
        barI.style.height = tempHeight;

        bar0.style.backgroundColor = '#007bff';
        barI.style.backgroundColor = '#007bff';

        await heapify(i, 0);

        if (isSortingPaused) {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (!isSortingPaused) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }
}

async function heapify(n, i) {
    const bars = container.children;
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) {
        largest = left;
    }

    if (right < n && parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) {
        largest = right;
    }

    if (largest !== i) {
        if (isSortingStopped) {
            return;
        }

        const barI = bars[i];
        const barLargest = bars[largest];
        barI.style.backgroundColor = 'red';
        barLargest.style.backgroundColor = 'red';

        await new Promise((resolve) => setTimeout(resolve, 50));

        const tempHeight = barI.style.height;
        barI.style.height = barLargest.style.height;
        barLargest.style.height = tempHeight;

        barI.style.backgroundColor = '#007bff';
        barLargest.style.backgroundColor = '#007bff';

        await heapify(n, largest);

        if (isSortingPaused) {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (!isSortingPaused) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }
}

async function countingSort() {
    setCurrentSortFunction(countingSort);

    const bars = container.children;
    const n = bars.length;
    const count = new Array(101).fill(0);

    for (let i = 0; i < n; i++) {
        count[parseInt(bars[i].style.height)]++;
    }

    let idx = 0;
    for (let i = 0; i <= 100; i++) {
        while (count[i] > 0) {
            if (isSortingStopped) {
                return;
            }

            const bar = bars[idx];
            bar.style.backgroundColor = 'red';
            await new Promise((resolve) => setTimeout(resolve, 50));

            bar.style.height = `${i * 4}px`;
            count[i]--;
            idx++;

            bar.style.backgroundColor = '#007bff';

            if (isSortingPaused) {
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (!isSortingPaused) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                });
            }
        }
    }
}

async function radixSort() {
    setCurrentSortFunction(radixSort);

    const bars = container.children;
    const n = bars.length;
    const maxNum = Math.max(...Array.from(bars).map((bar) => parseInt(bar.style.height)));
    let exp = 1;

    while (Math.floor(maxNum / exp) > 0) {
        const count = new Array(10).fill(0);
        const output = new Array(n);

        for (let i = 0; i < n; i++) {
            count[Math.floor(parseInt(bars[i].style.height) / exp) % 10]++;
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (let i = n - 1; i >= 0; i--) {
            if (isSortingStopped) {
                return;
            }

            const bar = bars[i];
            const height = parseInt(bar.style.height);
            bar.style.backgroundColor = 'red';
            await new Promise((resolve) => setTimeout(resolve, 50));

            output[count[Math.floor(height / exp) % 10] - 1] = height;
            count[Math.floor(height / exp) % 10]--;
            bar.style.backgroundColor = '#007bff';
        }

        for (let i = 0; i < n; i++) {
            if (isSortingStopped) {
                return;
            }

            const bar = bars[i];
            bar.style.backgroundColor = 'red';
            await new Promise((resolve) => setTimeout(resolve, 50));

            bar.style.height = `${output[i]}px`;
            bar.style.backgroundColor = '#007bff';
        }

        exp *= 10;

        if (isSortingPaused) {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (!isSortingPaused) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }
}

async function bucketSort() {
    setCurrentSortFunction(bucketSort);

    const bars = container.children;
    const n = bars.length;
    const buckets = new Array(n).fill().map(() => []);

    for (let i = 0; i < n; i++) {
        const bucketIndex = Math.floor(parseInt(bars[i].style.height) / 10);
        buckets[bucketIndex].push(parseInt(bars[i].style.height));
    }

    for (const bucket of buckets) {
        if (isSortingStopped) {
            return;
        }

        if (bucket.length > 1) {
            bucket.sort((a, b) => a - b);
        }
    }

    let idx = 0;
    for (const bucket of buckets) {
        if (isSortingStopped) {
            return;
        }

        for (const height of bucket) {
            if (isSortingStopped) {
                return;
            }

            const bar = bars[idx];
            bar.style.backgroundColor = 'red';
            await new Promise((resolve) => setTimeout(resolve, 50));

            bar.style.height = `${height}px`;
            idx++;

            bar.style.backgroundColor = '#007bff';

            if (isSortingPaused) {
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (!isSortingPaused) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                });
            }
        }
    }
}

function setCurrentSortFunction(sortFunction) {
    if (currentSortFunction !== sortFunction) {
        if (currentSortFunction) {
            stopSorting();
        }

        currentSortFunction = sortFunction;
        isSortingPaused = false;
        isSortingStopped = false;
        resetBarsColor();
    }
}

function resetBarsColor() {
    const bars = container.children;
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = '#007bff';
    }
}

function resetArray() {
    stopSorting();
    generateRandomArray();
}

generateRandomArray();
