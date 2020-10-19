import { searchPrivileges } from '../api/user.js'

export const getters = {
  hasPrivileges: state => (resContent) => {
    let aa = state.privileges.find(info => info.content === resContent)

    let b = state.systemAdmin || state.roles.indexOf('ROLE_ADMIN') >= 0 || aa !== undefined

    return b;
  },
  authorizedMenus: (state, getters) => {
    let authorizedMenus = []

    for (const menu of state.menus) {
      let h5_mode = menu.h5_mode
      if (h5_mode === undefined) {
        h5_mode = 0
      }
      let mainMenu = {
        'caption': menu.caption,
        'h5_mode': h5_mode,
        'submenus': []
      }

      let subCount = 0
      for (const submenu of menu.submenus) {
        if (submenu.h5_mode !== undefined) {

          // console.log(submenu)
        }

        if (submenu.authorized === 1) {
          if (getters.hasPrivileges(submenu.to)) {
            mainMenu.submenus.push(submenu)
            subCount++
          }
        } else if (submenu.caption === '') {
          if (subCount > 0) {
            mainMenu.submenus.push(submenu)  
            subCount = 0
          }          
        } else {
          mainMenu.submenus.push(submenu)
          subCount++
        }
      }

      if (mainMenu.submenus.length > 0) {
        // 去除最后一个 菜单分隔符
        const length = mainMenu.submenus.length
        const sub1 = mainMenu.submenus[length-1]
        if (sub1.to === '' && sub1.caption === '') {
          mainMenu.submenus.splice(length-1)
        }
      }
      
      if (mainMenu.submenus.length > 0) {
        authorizedMenus.push(mainMenu)
      }
    }

    // console.log(authorizedMenus)

    return authorizedMenus
  },
  isAdmin: state => {
    return state.roles.indexOf('ROLE_ADMIN') >= 0 || state.roles.indexOf('ROLE_SUPERVISOR') >= 0
  },
  getSearchCityCode: state => (targetCity) => {
    if (targetCity === 'Dcity') {
      return state.searchParams.dcity;
    } else if (targetCity === 'Acity') {
      return state.searchParams.acity;
    }

    return null;
  },
  customers: state => {
    return state.customers
  }
}
