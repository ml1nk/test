var React = require('react');
import menu from './index.css';

var NavBarItem = React.createClass({
  render: function() {
    return (
      <li>
        <NavBarLink submenu={this.props.submenu} url={this.props.url} text={this.props.text}/>
        {this.props.submenu && <NavBar items={this.props.submenu}/>}
      </li>
    );
  }
})

var NavBarLink = React.createClass({
  render: function() {
    return (
      <a className={this.props.submenu ? menu.parent : ""} href={this.props.url}>{this.props.text}</a>
    );
  }
})

var NavBar = module.exports = React.createClass({
  generateItem: function(item,id){
    return <NavBarItem key={id} text={item.text} url={item.url} submenu={item.submenu} />
  },
  render: function() {
    var items = this.props.items.map(this.generateItem);
    return (
      <ul className={menu.menu}>
      {items}
      </ul>
    );
  }
});
