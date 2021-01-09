class Application {
    constructor(param) {
        this.el = param.el;
        this.el.innerHTML = "";
        this.el.append(this.getBasicDOM());

        this.list = [{
                id: 1,
                content: "Купить хлеб",
                selected: true,
                done: false,
                archived: false,
            },
            {
                id: 2,
                content: "Помыть машину",
                selected: true,
                done: false,
                archived: false,
            },
            {
                id: 3,
                content: "Посмотреть JS",
                selected: false,
                done: false,
                archived: false,
            },
            {
                id: 4,
                content: "Покодить",
                selected: false,
                done: true,
                archived: false,
            },
            {
                id: 5,
                content: "Позвонить ветеренару",
                selected: false,
                done: true,
                archived: false,
            },
        ];

        this.update();
    }

    get someSelected () {
        // возвращает true когда выбран ходя бы один элемент
        return this.items.some(item => item.selected);
    }

    get items () {
        // возвращаем только те item, которые не заархивированы
        return this.list.filter(item => !item.archived);
    }

    update() {
        const app = this;
        // находим дата флаг data-items
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
                    }
                    else if (action === 'done') {
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