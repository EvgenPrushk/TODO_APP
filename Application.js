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
            },
            {
                id: 2,
                content: "Помыть машину",
                selected: true,
                done: false,
            },
            {
                id: 3,
                content: "Посмотреть JS",
                selected: false,
                done: false,
            },
            {
                id: 4,
                content: "Покодить",
                selected: false,
                done: true,
            },
            {
                id: 5,
                content: "Позвонить ветеренару",
                selected: false,
                done: true,
            },
        ];

        this.update();
    }

    update() {
        // находим дата флаг data-items
        const ulElement = this.el.querySelector('[data-items]');

        for (const item of this.list) {
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
        }


    }

    getItemDOM(item) {
        //из-за конфликта интересов div заменяем на ul
        const ulElement = document.createElement("ul");

        ulElement.innerHTML = `
       <li class="list-group-item">
       <div class="d-flex w-100 justify-content-between">
           <span>${item.content}</span>
           <div class="btn-group" role="group">
               <button type="button" class="btn btn-danger">Архив</button>
               <button type="button" class="btn btn-success">Cделано</button>
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
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-danger" disabled data-button-archiv>Архив</button>
                            <button type="button" class="btn btn-success" disabled data-button-done>Cделано</button>
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