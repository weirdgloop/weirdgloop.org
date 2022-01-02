(function () {
    'use strict';

    function get(selector, scope = document) {
        return scope.querySelector(selector);
    }

    function getAll(selector, scope = document) {
        return scope.querySelectorAll(selector);
    }

    // lets the reader use arrow keys to focus elements inside a target element,
    // requires the target element to have .focus and .elements properties
    // eg. parent.focus = 0;
    //     parent.elements = parent.querySelector('.elements-to-focus-on');
    //     parent.addEventListener('keydown', keyHandler);
    function keyHandler(event) {
        let target = event.currentTarget,
            elements = target.elements,
            key = event.code;

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            event.preventDefault(); // stop page from scrolling with arrow keys
            elements[target.focus].setAttribute('tabindex', -1);

            // move to next element
            if (['ArrowDown', 'ArrowRight'].includes(key)) {
                target.focus++;

                // if at the end, move to the start
                if (target.focus >= elements.length) {
                    target.focus = 0;
                }
            }
            // move to previous element
            else if (['ArrowUp', 'ArrowLeft'].includes(key)) {
                target.focus--;

                // if at the start, move to the end
                if (target.focus < 0) {
                    target.focus = elements.length - 1;
                }
            }

            elements[target.focus].setAttribute('tabindex', 0);
            elements[target.focus].focus();
        }
    }

    // based on <https://technokami.in/3d-hover-effect-using-javascript-animations-css-html>
    function initCards() {
        let cards = getAll('.wiki-card');

        // throttle the rate at which moveHandler updates (delay is in milliseconds)
        function throttleMoveHandler(delay) {
            let time = Date.now();

            return function (event) {
                if ((time + delay - Date.now()) < 0) {
                    moveHandler(event);
                    time = Date.now();
                }
            };
        }

        function moveHandler(event) {
            // get position of mouse cursor within element
            let rect = event.currentTarget.getBoundingClientRect(),
                xPos = event.clientX - rect.left,
                yPos = event.clientY - rect.top;

            // calculate rotation value along the axes
            const multiplier = 15,
                  cardWidth = event.currentTarget.clientWidth,
                  cardHeight = event.currentTarget.clientHeight,
                  yRotate = multiplier * ((xPos - cardWidth / 2) / cardWidth),
                  xRotate = -multiplier * ((yPos - cardHeight / 2) / cardHeight);

            // generate string for transform and apply styles
            const transform = `perspective(500px) scale(1.05) rotateX(${xRotate}deg) rotateY(${yRotate}deg)`;

            event.currentTarget.style.transform = transform;
            event.currentTarget.classList.add('card-hover');
        }

        // when viewport is < 500px the cards are full width and should not rotate
        // too lazy to use ResizeObserver
        if (document.body.clientWidth > 500) {
            cards.forEach(card => {
                card.addEventListener('mousemove', throttleMoveHandler(30), false);
                card.addEventListener('mouseout', function () {
                    card.removeAttribute('style');
                    card.classList.remove('card-hover');
                }, false);
            });
        }
    }

    // uses <https://github.com/wagerfield/parallax>, plant illustrations by Merds
    function initPlants() {
        if (!window.matchMedia('(prefers-reduced-motion)').matches) {
            let scenes = [get('.plants-top'), get('.plants-bottom')];

            for (let scene of scenes) {
                let plants = new Parallax(scene, {
                    hoverOnly: true,
                    originX: 0.45,
                    limitY: 0 // no vertical movement
                });
            }
        }
    }

    // based on <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role>
    function initTabs() {
        let tabs = getAll('.tab'),
            tabLists = getAll('.tab-list');

        tabs.forEach(tab => {
            tab.addEventListener('click', changeTabs, false);
        });

        // make tabs keyboard accessible
        tabLists.forEach(tabList => {
            tabList.focus = 0;
            tabList.elements = getAll('.tab', tabList);
            tabList.addEventListener('keydown', keyHandler, false);
        });

        function changeTabs(event) {
            let parent = event.currentTarget.parentNode, // aka .tab-list
                currTab = get('.tab[aria-selected="true"]', parent),
                nextTab = event.currentTarget;

            let tabArray = Array.prototype.slice.call(getAll('.tab', parent)),
                currTabIndex = tabArray.indexOf(currTab),
                nextTabIndex = tabArray.indexOf(nextTab);

            if (currTabIndex === nextTabIndex) {
                return;
            } else if (currTabIndex > nextTabIndex) {
                hideAndSlide('left');
            } else {
                hideAndSlide('right');
            }

            function hideAndSlide(direction) {
                let currPanel = get('#' + currTab.getAttribute("aria-controls")),
                    nextPanel = get('#' + nextTab.getAttribute("aria-controls")),
                    enterDuration = 350, // --anim-slow
                    exitDuration = 125; // --anim-fast

                // deselect current tab, select clicked tab
                currTab.setAttribute('aria-selected', false);
                nextTab.setAttribute('aria-selected', true);

                // hide old panel, reveal new panel
                currPanel.classList.add('slide', `slide-${direction}-fade-out`);

                window.setTimeout(function () {
                    currPanel.setAttribute('hidden', '');
                    currPanel.classList.remove('slide', `slide-${direction}-fade-out`);
                    nextPanel.removeAttribute('hidden');
                    nextPanel.classList.add('slide', `slide-${direction}-fade-in`);
                }, exitDuration);

                window.setTimeout(function () {
                    nextPanel.classList.remove('slide', `slide-${direction}-fade-in`);
                }, enterDuration + exitDuration);

                // set --index for sliding background on .tab-list::before
                parent.style.setProperty('--index', nextTabIndex);
            }
        }
    }

    // uses dygraphs library <http://dygraphs.com/>
    function initGraphs() {
        let trafficData = './data/traffic.csv',
            siteSpeedData = './data/site-speed.csv',
            editsData = './data/edits.csv',
            gridColor = '#efefef',
            locale = 'en-GB',
            dateOptions = {
                day: 'numeric',
                month: 'long'
            };

        // draw traffic graph
        let trafficGraph = new Dygraph(get('.traffic .dygraph-graph'), trafficData, {
                color: '#47a2d9',
                strokeWidth: 3,
                axisLineColor: gridColor,
                gridLineColor: gridColor,
                gridLineWidth: 1,
                highlightCircleSize: 4,
                xRangePad: 4, // must match highlightCircleSize
                labelsDiv: get('.traffic .dygraph-legend'),
                rollPeriod: 7,
                fillGraph: true,
                interactionModel: {
                    // allow user to drag finger across graph to see pageview numbers
                    'touchmove': function (event) {
                        let coords = event.touches[0];
                        let simulation = new MouseEvent('mousemove', {
                                clientX: coords.clientX,
                                clientY: coords.clientY
                            }
                        );

                        event.preventDefault();
                        event.target.dispatchEvent(simulation);
                    }
                },
                annotationMouseOverHandler: function (annotation) {
                    annotation.div.classList.remove('tooltip-hidden');
                    annotation.div.style.zIndex = '100'; // make sure tooltip appears on top of annotations
                },
                annotationMouseOutHandler: function (annotation) {
                    annotation.div.classList.add('tooltip-hidden');
                    annotation.div.style.removeProperty('z-index');
                },
                drawCallback: function (dygraph, isInitial) {
                    if (isInitial) {
                        dygraph.setAnnotations(trafficAnnotations);

                        // create custom x-axis labels (default ones are misaligned)
                        for (let i = 0; i < 12; i++) {
                            let month = new Date(2021, i).toLocaleString(locale, { month: 'short' }),
                                labelNode = document.createElement('div'),
                                shortLabel = document.createElement('span'),
                                longLabel = document.createElement('span');

                            labelNode.classList.add('x-label');
                            shortLabel.classList.add('short-month');
                            shortLabel.textContent = month.substring(0, 1);
                            longLabel.classList.add('long-month');
                            longLabel.textContent = month;

                            labelNode.appendChild(shortLabel);
                            labelNode.appendChild(longLabel);
                            get('.traffic .dygraph-x-labels').appendChild(labelNode);
                        }

                        // create custom y-axis labels (can't position default ones over top of graph)
                        let yAxisLabels = document.createElement('div');

                        yAxisLabels.classList.add('dygraph-y-labels');
                        get('.traffic .dygraph-graph').appendChild(yAxisLabels);

                        for (let i = 6; i >= 0; i--) {
                            let viewLabel = document.createElement('div');

                            viewLabel.classList.add('y-label');
                            viewLabel.textContent = i + ((i !== 0) ? 'm' : '');
                            yAxisLabels.appendChild(viewLabel);
                        }
                    }

                    trafficTooltips.forEach((tooltip, i) => {
                        // insert tooltip inside its respective annotation
                        let annotation = get(`.traffic .annotation-${i + 1}`);

                        annotation.appendChild(tooltip);
                        annotation.removeAttribute('title');
                    });
                },
                legendFormatter: function (data) {
                    let date, average, change;

                    if (data.x) {
                        date = new Date(data.xHTML).toLocaleString(locale, dateOptions);
                        average = data.series[0].yHTML.average;
                        change = data.series[0].yHTML.change;
                    }

                    return `<div class="dygraph-legend-date">${date}</div>` +
                           `<div class="dygraph-legend-views">Views: ${average}</div>` +
                           `<div class="dygraph-legend-change">7-day change: ${change}</div>`;
                },
                axes: {
                    x: {
                        drawAxis: false,
                        drawGrid: false
                    },
                    y: {
                        drawAxis: false,
                        includeZero: true,
                        valueRange: [0, 6500000],
                        valueFormatter: function (num, opts, series, graph, row, col) {
                            // original un-averaged value for this point
                            let currentValue = graph.getValue(row, col);

                            // 7-day change
                            let oneWeekAgo = graph.getValue(row - 7, col);
                            let change = Math.round((currentValue - oneWeekAgo) / oneWeekAgo * 100);

                            if (change < 0) {
                                // replace default hyphen (VERY WRONG) with actual negative symbol
                                change = '−' + change.toString().substring(1) + '%';
                            } else {
                                // plus sign for positive numbers
                                change = '+' + change + '%';
                            }

                            // 7-day change not possible for first 7 days
                            if (row < 7) change = 'N/A';

                            return {
                                actual: currentValue.toLocaleString(locale),
                                average: Math.round(num).toLocaleString(locale), // auto-averaged over rollPeriod
                                change: change
                            };
                        }
                    }
                }
            }
        );

        // create traffic annotations
        let trafficAnnotations = [
                {
                    x: "2021/01/04",
                    text: "RuneScape's 20th anniversary events begin"
                }, {
                    x: "2021/02/22",
                    text: "RuneScape: Azzanadra's Quest is released"
                }, {
                    x: "2021/05/26",
                    text: "Old School: Clans system is released"
                }, {
                    x: "2021/06/16",
                    text: "Old School: A Kingdom Divided is released"
                }, {
                    x: "2021/07/26",
                    text: "RuneScape: Nodon Front is released"
                }, {
                    x: "2021/10/06",
                    text: "Old School: Group Ironman Mode is released",
                    tickHeight: 33
                }, {
                    x: "2021/10/25",
                    text: "RuneScape: TzekHaar Front is released"
                }, {
                    x: "2021/11/25",
                    text: "Old School: Android client beta testing begins"
                }
            ],
            trafficTooltips = [];

        trafficAnnotations.forEach((annotation, i) => {
            annotation.series = 'Pageviews';
            annotation.shortText = i + 1;
            annotation.width = 24;
            annotation.height = 24;
            annotation.cssClass = `tooltip-hidden annotation-${i + 1}`;
            annotation.tickWidth = 2;
            if (annotation.tickHeight === undefined) annotation.tickHeight = 13;

            createTooltip(annotation.x, annotation.text, trafficTooltips);
        });

        // draw site speed graph
        let siteSpeedGraph = new Dygraph(get('.site-speed .dygraph-graph'), siteSpeedData, {
                color: '#f48121',
                strokeWidth: 3,
                axisLineColor: gridColor,
                gridLineColor: gridColor,
                gridLineWidth: 1,
                highlightCircleSize: 4,
                xRangePad: 4, // must match highlightCircleSize
                labelsDiv: get('.site-speed .dygraph-legend'),
                rollPeriod: 7,
                fillGraph: true,
                interactionModel: {
                    // allow user to drag finger across graph to see pageview numbers
                    'touchmove': function (event) {
                        let coords = event.touches[0];
                        let simulation = new MouseEvent('mousemove', {
                                clientX: coords.clientX,
                                clientY: coords.clientY
                            }
                        );

                        event.preventDefault();
                        event.target.dispatchEvent(simulation);
                    }
                },
                drawCallback: function (dygraph, isInitial) {
                    if (isInitial) {
                        // create custom x-axis labels (default ones are misaligned)
                        for (let i = 0; i < 12; i++) {
                            let month = new Date(2021, i).toLocaleString(locale, { month: 'short' }),
                                labelNode = document.createElement('div'),
                                shortLabel = document.createElement('span'),
                                longLabel = document.createElement('span');

                            labelNode.classList.add('x-label');
                            shortLabel.classList.add('short-month');
                            shortLabel.textContent = month.substring(0, 1);
                            longLabel.classList.add('long-month');
                            longLabel.textContent = month;

                            labelNode.appendChild(shortLabel);
                            labelNode.appendChild(longLabel);
                            get('.site-speed .dygraph-x-labels').appendChild(labelNode);
                        }

                        // create custom y-axis labels (can't position default ones over top of graph)
                        let yAxisLabels = document.createElement('div');

                        yAxisLabels.classList.add('dygraph-y-labels');
                        get('.site-speed .dygraph-graph').appendChild(yAxisLabels);

                        for (let i = 400; i >= 0; i -= 100) {
                            let viewLabel = document.createElement('div');

                            viewLabel.classList.add('y-label');
                            viewLabel.textContent = i + ((i !== 0) ? 'ms' : '');
                            yAxisLabels.appendChild(viewLabel);
                        }
                    }
                },
                legendFormatter: function (data) {
                    let date, actual, average, change;

                    if (data.x) {
                        date = new Date(data.xHTML).toLocaleString(locale, dateOptions);
                        actual = data.series[0].yHTML.actual;
                        average = data.series[0].yHTML.average;
                        change = data.series[0].yHTML.change;
                    }

                    return `<div class="dygraph-legend-date">${date}</div>` +
                           `<div class="dygraph-legend-views">Time: ${average} ms</div>` +
                           `<div class="dygraph-legend-change">7-day change: ${change}</div>`;
                },
                axes: {
                    x: {
                        drawAxis: false,
                        drawGrid: false
                    },
                    y: {
                        drawAxis: false,
                        includeZero: true,
                        valueRange: [0, 500],
                        valueFormatter: function (num, opts, series, graph, row, col) {
                            // original un-averaged value for this point
                            let currentValue = graph.getValue(row, col);

                            // 7-day change
                            let oneWeekAgo = graph.getValue(row - 7, col);
                            let change = Math.round((currentValue - oneWeekAgo) / oneWeekAgo * 100);

                            if (change < 0) {
                                // replace default hyphen (VERY WRONG) with actual negative symbol
                                change = '−' + change.toString().substring(1) + '%';
                            } else {
                                // plus sign for positive numbers
                                change = '+' + change + '%';
                            }

                            // 7-day change not possible for first 7 days
                            if (row < 7) change = 'N/A';

                            return {
                                actual: currentValue.toLocaleString(locale),
                                average: Math.round(num).toLocaleString(locale), // auto-averaged over rollPeriod
                                change: change
                            };
                        }
                    }
                }
            }
        );

        // draw edits graph
        let editsGraph = new Dygraph(get('.edits .dygraph-graph'), editsData, {
                color: '#6988de',
                strokeWidth: 3,
                axisLineColor: gridColor,
                gridLineColor: gridColor,
                gridLineWidth: 1,
                highlightCircleSize: 4,
                xRangePad: 4, // must match highlightCircleSize
                labelsDiv: get('.edits .dygraph-legend'),
                rollPeriod: 7,
                fillGraph: true,
                interactionModel: {
                    // allow user to drag finger across graph to see pageview numbers
                    'touchmove': function (event) {
                        let coords = event.touches[0];
                        let simulation = new MouseEvent('mousemove', {
                                clientX: coords.clientX,
                                clientY: coords.clientY
                            }
                        );

                        event.preventDefault();
                        event.target.dispatchEvent(simulation);
                    }
                },
                drawCallback: function (dygraph, isInitial) {
                    if (isInitial) {
                        // create custom x-axis labels (default ones are misaligned)
                        for (let i = 0; i < 12; i++) {
                            let month = new Date(2021, i).toLocaleString(locale, { month: 'short' }),
                                labelNode = document.createElement('div'),
                                shortLabel = document.createElement('span'),
                                longLabel = document.createElement('span');

                            labelNode.classList.add('x-label');
                            shortLabel.classList.add('short-month');
                            shortLabel.textContent = month.substring(0, 1);
                            longLabel.classList.add('long-month');
                            longLabel.textContent = month;

                            labelNode.appendChild(shortLabel);
                            labelNode.appendChild(longLabel);
                            get('.edits .dygraph-x-labels').appendChild(labelNode);
                        }

                        // create custom y-axis labels (can't position default ones over top of graph)
                        let yAxisLabels = document.createElement('div');

                        yAxisLabels.classList.add('dygraph-y-labels');
                        get('.edits .dygraph-graph').appendChild(yAxisLabels);

                        for (let i = 4; i >= 0; i--) {
                            let viewLabel = document.createElement('div');

                            viewLabel.classList.add('y-label');
                            viewLabel.textContent = i + ((i !== 0) ? 'k' : '');
                            yAxisLabels.appendChild(viewLabel);
                        }
                    }
                },
                legendFormatter: function (data) {
                    let date, actual, average, change;

                    if (data.x) {
                        date = new Date(data.xHTML).toLocaleString(locale, dateOptions);
                        actual = data.series[0].yHTML.actual;
                        average = data.series[0].yHTML.average;
                        change = data.series[0].yHTML.change;
                    }

                    return `<div class="dygraph-legend-date">${date}</div>` +
                           `<div class="dygraph-legend-views">Edits: ${average}</div>` +
                           `<div class="dygraph-legend-change">7-day change: ${change}</div>`;
                },
                axes: {
                    x: {
                        drawAxis: false,
                        drawGrid: false
                    },
                    y: {
                        drawAxis: false,
                        includeZero: true,
                        valueRange: [0, 4600],
                        valueFormatter: function (num, opts, series, graph, row, col) {
                            // original un-averaged value for this point
                            let currentValue = graph.getValue(row, col);

                            // 7-day change
                            let oneWeekAgo = graph.getValue(row - 7, col);
                            let change = Math.round((currentValue - oneWeekAgo) / oneWeekAgo * 100);

                            if (change < 0) {
                                // replace default hyphen (VERY WRONG) with actual negative symbol
                                change = '−' + change.toString().substring(1) + '%';
                            } else {
                                // plus sign for positive numbers
                                change = '+' + change + '%';
                            }

                            // 7-day change not possible for first 7 days
                            if (row < 7) change = 'N/A';

                            return {
                                actual: currentValue.toLocaleString(locale),
                                average: Math.round(num).toLocaleString(locale), // auto-averaged over rollPeriod
                                change: change
                            };
                        }
                    }
                }
            }
        );

        function createTooltip(date, text, tooltips) {
            let tooltip = document.createElement('div'),
                dateNode = document.createElement('div'),
                textNode = document.createElement('div');

            dateNode.classList.add('tooltip-date');
            dateNode.textContent = new Date(date).toLocaleString(locale, dateOptions);
            textNode.textContent = text;

            tooltip.classList.add('tooltip');
            tooltip.appendChild(dateNode);
            tooltip.appendChild(textNode);
            tooltips.push(tooltip);
        }
    }

    // design and ux borrowed from NYT quizzes <https://www.nytimes.com/spotlight/news-quiz>
    function initQuiz() {
        let request = new XMLHttpRequest();
        let requestURL = 'data/cryptic.json';
        let quiz = get('.quiz');
        let questions;
        let numberTotal;
        let numberCorrect = 0;
        let numberAnswered = 0;

        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        request.addEventListener('load', function () {
            setupButtons();
        }, false);

        function setupButtons() {
            let buttonGroup = document.createElement('div');

            buttonGroup.classList.add('quiz-button-group', 'stat');
            quiz.appendChild(buttonGroup);
            buildButton('RuneScape', 'rs');
            buildButton('Old School RuneScape', 'osrs');
            buildButton('RuneScape Classic', 'rsc');
        }

        function buildButton(label, game) {
            let button = document.createElement('button');

            button.classList.add('button', 'quiz-start', game);
            button.textContent = label;
            button.addEventListener('click', function () {
                get('.quiz-button-group').remove();
                setupQuestions(game);
                buildQuestions(questions);
            }, false);

            get('.quiz-button-group').appendChild(button);
        }

        function setupQuestions(game) {
            switch (game) {
                case 'rs':
                    questions = request.response[0].rs;
                    break;
                case 'osrs':
                    questions = request.response[0].osrs;
                    break;
                case 'rsc':
                    questions = request.response[0].rsc;
                    break;
            }

            // 10 for rs and osrs, but 9 for rsc
            numberTotal = questions.length;

            // need class for css
            quiz.classList.add(game);
        }

        function buildQuestions(questions) {
            questions.forEach((question, i) => {
                let groupNode = get('.template-quiz-group').content.cloneNode(true);
                let choicesNode = get('.quiz-choice-group', groupNode);
                let explanationNode = get('.quiz-explanation', groupNode);
                let letters = ['a', 'b', 'c', 'd'];

                // fill in <template> with quiz data
                get('.quiz-number', groupNode).textContent = `Question ${i + 1} of ${numberTotal}`;
                get('.quiz-question', groupNode).textContent = question.question;
                letters.forEach((letter, i) => {
                    let choice = document.createElement('li');

                    // tabindex="0" for first element so it can be focused, "-1" for the rest
                    choice.setAttribute('tabindex', (i === 0) ? 0 : -1);
                    choice.classList.add('quiz-choice', 'button');
                    choice.dataset.letter = letter;
                    choice.textContent = question.answers[letter];

                    choicesNode.appendChild(choice);
                });

                // validate choice when clicked
                choicesNode.addEventListener('click', clicked, false);

                // simulate click with enter/space key
                choicesNode.addEventListener('keydown', pressed, false);

                // make quiz arrow-key accessible
                choicesNode.focus = 0;
                choicesNode.elements = getAll('.quiz-choice', choicesNode);
                choicesNode.addEventListener('keydown', keyHandler, false);

                // add finished question and choice group into dom
                quiz.appendChild(groupNode);

                function clicked(e) {
                    if (!e.target.classList.contains('quiz-choice')) return;

                    let selectedLetter = e.target.dataset.letter;
                    let correctLetter = question.correctAnswer;
                    let explanation = question.explanation;

                    // css to highlight chosen answer
                    if (selectedLetter === correctLetter) {
                        e.target.classList.add('selected', 'correct');
                        numberCorrect++;
                    } else {
                        // reveal correct answer in addition to user's choice
                        get(`[data-letter=${correctLetter}]`, choicesNode).classList.add('not-selected', 'correct');
                        e.target.classList.add('selected', 'incorrect');
                    }

                    // add explanation for correct answer
                    if (explanation) explanationNode.innerHTML = explanation;

                    // stop keyHandler() focusing when input is not via keyboard
                    e.target.blur();

                    // choices shouldn't be focusable once answered
                    choicesNode.elements.forEach(choice => {
                        choice.setAttribute('tabindex', -1);
                    });

                    // other things to run after question has been answered
                    e.target.closest('.quiz-group').classList.add('answered');
                    choicesNode.removeEventListener('click', clicked, false);
                    choicesNode.removeEventListener('keydown', pressed, false);
                    choicesNode.removeEventListener('keydown', keyHandler, false);

                    numberAnswered++;
                    if (numberAnswered === numberTotal) showResults();
                }

                function pressed(event) {
                    let focused = document.activeElement;
                    let isValidKey = event.code === 'Enter' || event.code === 'Space';
                    let isQuizChoice = choicesNode.contains(focused) && focused.classList.contains('quiz-choice');

                    if (isValidKey && isQuizChoice) {
                        event.preventDefault(); // stop space from paging down
                        focused.click();
                    }
                }
            });
        }

        function showResults() {
            let resultsNode = get('.template-quiz-results').content.cloneNode(true);
            let headerNode = get('h3', resultsNode);
            let descNode = get('p:first-of-type', resultsNode);
            let score = numberCorrect / numberTotal;

            headerNode.textContent = `You answered ${numberCorrect} out of ${numberTotal} questions correctly.`;
            headerNode.style.fontSize = '1.25em';

            if (score >= 0.6) {
                descNode.innerHTML = 'Very good. You should consider helping us with our <a class="link" target="_blank" rel="noopener" href="https://rs.wiki/RS:OSWF">RS Wiki</a> and <a class="link" target="_blank" rel="noopener" href="https://osrs.wiki/RS:OSWF">OSRS Wiki projects</a> – we\'ll reward you for your work!';
            } else if (score >= 0.3) {
                descNode.textContent = 'Could\'ve been worse. Hopefully you\'ll do better on next year\'s quiz.';
            } else {
                descNode.textContent = 'Maybe you should spend a little more time on the wiki.';
            }

            quiz.appendChild(resultsNode);
            get('.reset-quiz').addEventListener('click', function resetQuiz() {
                numberCorrect = 0;
                numberAnswered = 0;
                quiz.textContent = '';
                quiz.classList.remove(quiz.classList.item(1)); // remove game version class
                get('h2#quiz').scrollIntoView({ behavior: 'smooth' });
                setupButtons();
            }, false);
        }
    }

    function initModal() {
        let pictures = getAll('picture');
        let src = 'srcFull';

        // use different image depending on if user's display supports P3
        // <https://webkit.org/blog/10042/wide-gamut-color-in-css-with-display-p3/>
        // if (window.matchMedia('(color-gamut: p3)').matches) src = 'srcFullP3';

        for (let picture of pictures) {
            picture.addEventListener('mouseover', preloadFullImage, { once: true });
            picture.addEventListener('click', openModal, false);
        }

        function preloadFullImage(event) {
            let preloader = document.createElement('link');

            preloader.href = event.currentTarget.dataset[src];
            preloader.rel = 'preload';
            preloader.as = 'image';

            document.head.appendChild(preloader);
        }

        function openModal(event) {
            let modalTemplate = get('.template-modal').content.cloneNode(true),
                modal = get('.modal', modalTemplate),
                image = get('.full-image', modalTemplate);

            modal.addEventListener('click', closeModal, false);
            image.src = event.currentTarget.dataset[src];

            document.body.style.overflow = 'hidden';
            document.body.appendChild(modalTemplate);
            document.addEventListener('keydown', escToClose, false);
        }

        function closeModal() {
            get('.modal').remove();
            document.body.removeAttribute('style'); // unset overflow: hidden
            document.removeEventListener('keydown', escToClose, false);
        }

        function escToClose(event) {
            if (event.code === 'Escape') closeModal();
        }
    }

    initPlants();
    initCards();
    initTabs();
    initGraphs();
    initQuiz();
    initModal();
}());