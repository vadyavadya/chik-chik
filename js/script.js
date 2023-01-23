const API_URL = 'https://glowing-glen-epoch.glitch.me/api';

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

const initService = () => {
    const priceList = document.querySelector('.price__content');
    priceList.textContent = '';

    addPreload(priceList);

    fetch(API_URL)
        .then((response) => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
}

const init = () => {
    initSlider();
    initService();
}

window.addEventListener('DOMContentLoaded', init);