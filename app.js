const photos = document.getElementById('photos')
const menu = document.getElementById('menu-tray')

// Utils
const pipe = (...fns) => (x) => fns.reduce((a,c) => c(a),x)

const prop = (prop) => (obj) => obj.prop

// State
const state = {
    $ : {
        menu_open    : false,
        photo_scroll : 0
    },
    getState () { return state.$ },
    setState ($$) { return Object.assign(state.$,$$) }
}

//Business
function toggle_menu ({menu_open}) {
    return state.setState({menu_open : !menu_open})
}

function openMenu () {
    menu.classList.add('menu-open')
    menu.classList.remove('menu-close')
}

function closeMenu () {
    menu.classList.add('menu-close')
    menu.classList.remove('menu-open')
}

function update_menu_component ({menu_open}) {
    (menu_open)
        ? openMenu()
        : closeMenu()
}

function isElementFullyScrolled (element) {
    return element.scrollWidth - element.clientWidth <= element.scrollLeft;
}

function calculateScrollPosition (element) {
    return function (position) {
        return element.scrollLeft
    }
}

function scrollElementBy (element) {
    return function (photo_scroll) {
        const updated_state = state.setState({
            photo_scroll : (!isElementFullyScrolled(element))
                ? photo_scroll+300
                : 0
        })
        element.scroll(updated_state.photo_scroll,0)
        return null
    }
}

function scrollElementBackBy (element) {
    return function (photo_scroll) {
        const updated_state = state.setState({
            photo_scroll : (photo_scroll>0)
                ? photo_scroll-300
                : 0
        })
        element.scroll(updated_state.photo_scroll,0)
        return null
    }
}

// Reducers
const actions = {
    toggle_menu : pipe(
        state.getState,
        toggle_menu,
        update_menu_component
    ),
    scrollPhotosRight : pipe(
        state.getState,
        prop('photo_scroll'),
        calculateScrollPosition(photos),
        scrollElementBy(photos)
    ),
    scrollPhotosLeft : pipe(
        state.getState,
        prop('photo_scroll'),
        calculateScrollPosition(photos),
        scrollElementBackBy(photos)
    )
}

// Interface
document.getElementById('photos-control-right')
        .addEventListener('click',actions.scrollPhotosRight)

document.getElementById('photos-control-left')
        .addEventListener('click',actions.scrollPhotosLeft)

document.getElementById('menu-button')
    .addEventListener('click',actions.toggle_menu)

document.getElementById('menu-tray')
    .addEventListener('click',actions.toggle_menu)
