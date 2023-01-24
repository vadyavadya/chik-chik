const API_URL = 'https://glowing-glen-epoch.glitch.me/';


/* 
GET /api - получить список услуг
GET /api?service={n} - получить список барберов
GET /api?spec={n} - получить список месяца работы барбера
GET /api?spec={n}&month={n} - получить список дней работы барбера
GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
POST /api/order - оформить заказ 
*/

const addPreload = (elem) => {
    elem.classList.add('preload');
}

const removePreload = (elem) => {
    elem.classList.remove('preload')
}

const startSlider = (slider) => {

    const sliderItems = slider.querySelectorAll('.slider__item');
    const sliderList = slider.querySelector('.slider__list');
    const btnPrevSlide = slider.querySelector('.slider__arrow_left');
    const btnNextSlide = slider.querySelector('.slider__arrow_right');

    let activeSlide = 1;
    let position = 0;

    const checkSlider = () => {
        if ((activeSlide + 2 === sliderItems.length &&
            document.documentElement.offsetWidth > 560) ||
            activeSlide === sliderItems.length) {

            btnNextSlide.style.display = 'none';
        } else {
            btnNextSlide.style.display = '';
        }

        if (activeSlide === 1) {
            btnPrevSlide.style.display = 'none';
        } else {
            btnPrevSlide.style.display = '';
        }
    }
    checkSlider();

    const fixHeight = () => {
        let sliderHeight = sliderItems[activeSlide].offsetHeight;
        sliderList.style.height = `${sliderHeight}px`;
        setTimeout(() => {
            sliderList.style.height = '';
        }, 3000)
    }

    const prevSlide = () => {
        fixHeight();
        sliderItems[activeSlide]?.classList.remove('slider__item_active');
        position = -sliderItems[0].clientWidth * (activeSlide - 2);
        sliderList.style.transform = `translateX(${position}px)`
        activeSlide -= 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlider();
    }
    const nextSlide = () => {
        fixHeight();
        sliderItems[activeSlide]?.classList.remove('slider__item_active');
        position = -sliderItems[0].clientWidth * activeSlide;
        sliderList.style.transform = `translateX(${position}px)`
        activeSlide += 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlider();
    }

    // Добавление плавности
    sliderList.style.transition = `transform 0.3s ease 0s`;

    btnPrevSlide.addEventListener('click', prevSlide);
    btnNextSlide.addEventListener('click', nextSlide);

    window.addEventListener('resize', () => {
        setTimeout(() => {
            if (activeSlide + 2 > sliderItems.length &&
                document.documentElement.offsetWidth > 560) {
                activeSlide = sliderItems.length - 2;
                sliderItems[activeSlide]?.classList.add('slider__item_active');
            }

            position = -sliderItems[0].clientWidth * (activeSlide - 1);
            sliderList.style.transform = `translateX(${position}px)`;
            checkSlider();
        }, 100)
    })
}

const initSlider = () => {
    const slider = document.querySelector('.slider');
    const sliderContainer = slider.querySelector('.slider__container');

    sliderContainer.style.opacity = '0';
    addPreload(slider);

    window.addEventListener('load', () => {

        sliderContainer.style.transition = 'opacity 3s'
        sliderContainer.style.opacity = '1';
        setTimeout(() => {
            sliderContainer.style.transition = ''
            sliderContainer.style.opacity = '';
        }, 3000);
        removePreload(slider);

        startSlider(slider);
    });
}

const renderPrice = (priceList, data) => {
    data.forEach(element => {
        const priceItem = document.createElement('li');
        priceItem.classList.add('price__item');
        priceItem.innerHTML = `
        <span class="price__item-title">${element.name}</span>
        <span class="price__item-count">${element.price} руб</span>
        `;
        priceList.append(priceItem);
    });

}

const renderService = (wrapper, data) => {
    const labels = data.map(elem => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
            <input class="radio__input" type="radio" name="service" value="${elem.id}">
            <span class="radio__label">${elem.name}</span>
            `;
        return label;
    });

    wrapper.append(...labels);
}

const initService = () => {
    const priceList = document.querySelector('.price__content');
    priceList.textContent = '';
    addPreload(priceList);

    const reserveFieldsetService = document.querySelector('[name=filedsetservice]');
    reserveFieldsetService.innerHTML = `<legend class="reserve__legend">Услуга</legend>`;
    addPreload(reserveFieldsetService);


    fetch(`${API_URL}/api`)
        .then((response) => {
            return response.json();
        })
        .then(data => {
            renderPrice(priceList, data);
            removePreload(priceList);
            return data;
        })
        .then(data => {
            renderService(reserveFieldsetService, data);
            removePreload(reserveFieldsetService);
        })

}

const addDisabled = (arr) => {
    arr.forEach(elem => {
        elem.disabled = true;
    })
}

const removeDisabled = (arr) => {
    arr.forEach(elem => {
        elem.disabled = false;
    })
}

const renderSpec = (wrapper, data) => {
    const labels = data.map(item => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
        <input class="radio__input" type="radio" name="spec" value="${item.id}">
        <span class="radio__label radio__label_spec" style="--bg-image: url('${API_URL}${item.img}')">${item.name}</span>            
        `;
        return label;
    });

    wrapper.append(...labels);
}

const renderMonth = (wrapper, data) => {
    const labels = data.map(item => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
        <input class="radio__input" type="radio" name="month" value="0${item}">
        <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date('0' + item))} 0${item}</span>            
        `;
        return label;
    });

    wrapper.append(...labels);
}

const renderDay = (wrapper, data, month) => {
    const labels = data.map(item => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
        <input class="radio__input" type="radio" name="day" value="${item}">
        <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', { month: 'long', day: "numeric" }).format(new Date(`${month}/${item}`))}</span>            
        `;
        return label;
    });

    wrapper.append(...labels);
}

const renderTime = (wrapper, data) => {
    const labels = data.map(item => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
            <input class="radio__input" type="radio" name="time" value="${item}">
            <span class="radio__label">${item}`;
        return label;
    });

    wrapper.append(...labels);
}

const initReserve = () => {
    const reserveForm = document.querySelector('.reserve__form');

    // Стандартно
    /* addDisabled([
        reserveForm.filedsetspec,
        reserveForm.filedsetmonth,
        reserveForm.filedsetday,
        reserveForm.filedsettime,
        reserveForm.btn,
    ]); */

    //* Деструктивное представление
    const { filedsetservice, filedsetspec, filedsetmonth, filedsetday, filedsettime, btn, } = reserveForm;

    addDisabled([filedsetspec, filedsetmonth, filedsetday, filedsettime, btn,]);

    reserveForm.addEventListener('change', async event => {
        const target = event.target;
        console.log('target: ', target);

        if (target.name === 'service') {
            addDisabled([filedsetspec, filedsetmonth, filedsetday, filedsettime, btn,]);
            filedsetspec.innerHTML = `<legend class="reserve__legend">Специалист</legend>`;
            addPreload(filedsetspec);
            const response = await fetch(`${API_URL}/api?service=${target.value}`);
            const data = await response.json();
            renderSpec(filedsetspec, data);
            removePreload(filedsetspec);
            removeDisabled([filedsetspec]);
        }

        if (target.name === 'spec') {
            addDisabled([filedsetmonth, filedsetday, filedsettime, btn,]);
            filedsetmonth.innerHTML = '';
            addPreload(filedsetmonth);
            const response = await fetch(`${API_URL}/api?spec=${target.value}`);
            const data = await response.json();
            renderMonth(filedsetmonth, data);
            removePreload(filedsetmonth);
            removeDisabled([filedsetmonth]);
        }

        if (target.name === 'month') {
            addDisabled([filedsetday, filedsettime, btn,]);
            filedsetday.innerHTML = '';
            addPreload(filedsetday);
            const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${target.value}`);
            const data = await response.json();
            renderDay(filedsetday, data, target.value);
            removePreload(filedsetday);
            removeDisabled([filedsetday]);
        }

        if (target.name === 'day') {
            addDisabled([filedsettime, btn,]);
            filedsettime.innerHTML = '';
            addPreload(filedsettime);
            const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`);
            const data = await response.json();
            renderTime(filedsettime, data);
            removePreload(filedsettime);
            removeDisabled([filedsettime]);
        }

        if (target.name === 'time') {
            removeDisabled([btn]);
        }
    })

    reserveForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(reserveForm);

        const json = JSON.stringify(Object.fromEntries(formData));

        const response = await fetch(`${API_URL}api/order`, {
            method: 'post',
            body: json,
        });

        const data = await response.json();
        addDisabled([filedsetservice, filedsetspec, filedsetmonth, filedsetday, filedsettime, btn,])

        const p = document.createElement('p');
        p.textContent = `
        Спасибо за бронь #${data.id}!
        Ждем вас ${Intl.DateTimeFormat('RU-ru', {
            month: "long",
            day: "numeric",
        }).format(new Date(`${data.month}/${data.day}`))}, время ${data.time}
        `;
        reserveForm.append(p);
    })
}

const init = () => {
    initSlider();
    initService();
    initReserve();
}

window.addEventListener('DOMContentLoaded', init);