var React = require('react');
var ReactDOM = require('react-dom');

var NavBar = require('./components/menu/index.jsx');

var data = [
  {
    "text": "Link 1",
    "url": "#"
  },
  {
    "text": "Link 2",
    "url": "#"
  },
  {
    "text": "Link 3",
    "url": "#",
    "submenu": [
      {
        "text": "Sublink 1",
        "url": "#",
        "submenu": [
          {
            "text": "SubSublink 1",
            "url": "#"
          }
        ]
      },
      {
        "text": "Sublink 2",
        "url":"#",
        "submenu": [
          {
            "text": "SubSublink 2",
            "url": "#"
          }
        ]
      }
    ]
  }
]

ReactDOM.render(<NavBar items={data} />, document.getElementById("mount"));



/*
class HelloMessage extends React.Component {
  render() {
    return <div className={styles.app}><p>Hello {this.props.name}</p></div>;
  }
}
ReactDOM.render(<HelloMessage name="Jane" />, document.getElementById("mount"));
*/
