class Application {
    constructor(param) {
        const app = this;
        this.el = param.el;

        this.el.innerHTML = "";
        this.el.append(this.getBasicDOM());

        const panelElement = this.el.querySelector('[data-panel]');
        panelElement
            .querySelector('[data-button="done"]')
            .addEventListener('click', event => {
                for (let item of this.list) {
                    if (item.selected) {
                        item.done = !item.done;
                        item.selected = false;
                    }
                }
                // можем использовать this и () => {} т.к. функция не создлает своей области видимости 
                this.update();
            });

        panelElement
            .querySelector('[data-button="archiv"]')
            .addEventListener('click', event => {
                for (let item of this.list) {
                    if (item.selected) {
                        item.archived = !item.archived;
                        item.selected = false;
                    }
                }
                // можем использовать this и () => {} т.к. функция не создлает своей области видимости 
                this.update();
            });

        this.el
            .querySelector('input') // не используем стрелочную функцию из-за потери контента
            .addEventListener('keydown', function (event) {
                if (event.key !== "Enter" || !this.value.trim()) {
                    return;
                }
                // ноль передается, если вдруг поле пустое
                const id = Math.max(0, ...app.list.map(x => x.id)) + 1;
                app.list.push({
                    id: id,
                    // удаляет пробельные символы с начала и конца строки trim()
                    content: this.value.trim(),
                    selected: false,
                    done: false,
                    archived: false,
                });
                // отсортируем список по айдишнику в порядке убывания
                // чтобы последнее сообщения выводилось первым

                app.list = app.list.sort((a, b) => b.id - a.id);

                // после enter остается пустая строчка
                this.value = '';

                app.update();
            });

        if (localStorage.getItem("__TODO_APPLICATION__")) {
            this.list = JSON.parse(localStorage.getItem("__TODO_APPLICATION__"));
        }  
        
        else {
            this.list = [];
        }

        // this.list = [{
        //         id: 5,
        //         content: "Купить хлеб",
        //         selected: false,
        //         done: false,
        //         archived: false,
        //     },
        //     {
        //         id: 4,
        //         content: "Помыть машину",
        //         selected: false,
        //         done: false,
        //         archived: false,
        //     },
        //     {
        //         id: 3,
        //         content: "Посмотреть JS",
        //         selected: false,
        //         done: false,
        //         archived: false,
        //     },
        //     {
        //         id: 2,
        //         content: "Покодить",
        //         selected: false,
        //         done: true,
        //         archived: false,
        //     },
        //     {
        //         id: 1,
        //         content: "Позвонить ветеренару",
        //         selected: false,
        //         done: true,
        //         archived: false,
        //     },
        // ];

        this.update();
    }


    get someSelected() {
        // возвращает true когда выбран ходя бы один элемент
        return this.items.some(item => item.selected);
    }

    get items() {
        // возвращаем только те item, которые не заархивированы
        return this.list.filter(item => !item.archived);
    }

    update() {
        const app = this;
        // находим дата флаг data-items
        // первым аргументом передается ключ, вторым аргументом
        // передаем строку - преобразованный объект с помощью JSON.stringify
        localStorage.setItem("__TODO_APPLICATION__", JSON.stringify(this.list));

        const ulElement = this.el.querySelector('[data-items]');
        ulElement.innerHTML = '';
        // меняем list на items, что бы убрать элементы, которые не заархивированы
        for (const item of this.items) {
            const liElement = this.getItemDOM(item);
            ulElement.append(liElement);

            if (item.selected) {
                //добавляем цвет над выбранным элементом
                liElement.classList.add("active");
            }
            if (item.done) {
                // добавляем к выполнненым класс item-done
                liElement.querySelector('span').classList.add("item-done");
            }
            // стрелочная функция унаследует область видимости родителя,
            // но теряется возможность обращеняи к тому элементу где происходит событие
            // в большем приложении лучше использовать классическую функцию
            liElement.addEventListener('click', function (event) {

                console.log(this);
                if (event.target.tagName === "BUTTON") {
                    const action = event.target.getAttribute('data-button');
                    if (action === 'archiv') {
                        item.archived = true;
                        app.update();
                    } else if (action === 'done') {
                        item.done = !item.done;
                        app.update();
                    }
                } else {
                    console.log('not key');
                    item.selected = !item.selected;
                    app.update();
                }
            });
        }

        const panelElement = this.el.querySelector('[data-panel]');
        const buttonElement = panelElement.querySelectorAll('[data-button]');
        buttonElement.forEach(element => element.removeAttribute('disabled'));
        if (!this.someSelected) {
            // setAttribute всегда требует второго аргумента true or false
            buttonElement.forEach(element => element.setAttribute('disabled', true));
        }
    }

    getItemDOM(item) {
        //из-за конфликта интересов div заменяем на ul
        const ulElement = document.createElement("ul");
        // если this.someSelected = true скрываем кнопку
        ulElement.innerHTML = `
        <li class="list-group-item">
        <div class="d-flex w-100 justify-content-between">
            <span>${item.content}</span>
                <div class="btn-group" role="group" ${this.someSelected ? "style='visibility: hidden'" : ""}>
                <button type="button" class="btn btn-danger" data-button="archiv">Архив</button>
                <button type="button" class="btn btn-success" data-button="done">Cделано</button>
                </div>
        </div>
        </li>`;

        return ulElement.firstElementChild;
    }

    getBasicDOM() {
        const divElement = document.createElement("div");
        divElement.innerHTML = `
        <div class="container">
        <div class="card" style="max-width: 700px; margin: 10px auto">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <div class="d-flex">
                        <input type="text" class="form-control" placeholder="Еще одно дело">
                        <div class="btn-group" role="group" data-panel>
                            <button type="button" class="btn btn-danger"  data-button="archiv">Архив</button>
                            <button type="button" class="btn btn-success"  data-button="done">Cделано</button>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="list-group list-group-flush" data-items></ul>
        </div>
    </div>`;

        return divElement.firstElementChild;
    }
}