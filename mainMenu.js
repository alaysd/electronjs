module.exports = [{
  label:'Electron',
  submenu:[
    {label:'Item 1'},
    {label:'Item 2'}
  ]
},{
  label:'Action',
  submenu:[{
      label:'Greet',

      click: ()=>{
        console.log('Hello from firstApp');
      },
      accelerator:'Shift+Alt+G',
      enabled:false
    },{
      label:'Blah',
      submenu:[
          {label:'b1'},
          {label:'b2'}
      ]
    }
  ]
},{
  label:'ToggleDeveloperTools',
  submenu:[{
    label:'On/Off',
    role:'toggledevtools'
  },{
    role:'togglefullscreen'
  },{
    role:'copy'
  },{
    role:'paste'
  }]
}
]


// The array which you are exporting cannot have a label alone without submenu
