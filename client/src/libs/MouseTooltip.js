import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line import/no-extraneous-dependencies

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class MouseTooltip extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      xPositionTrack: 0,
      yPositionTrack: 0,
      listenerActive: false,
      visible: false
    });

    _defineProperty(this, "getTooltipPosition", ({
      clientX: xPositionTrack,
      clientY: yPositionTrack
    }) => {
      this.setState({
        xPositionTrack,
        yPositionTrack,
      });
      // console.log(this.state.xPositionTrack);
      // console.log(this.state.yPositionTrack);
    });

    _defineProperty(this, "updateTooltipPosition", () => {
      const xPosition = this.state.xPositionTrack;
      const yPosition = this.state.yPositionTrack;

      this.setState({
        xPosition,
        yPosition
      });

      this.props.enableMouseTooltip();
      console.log("updated tooltip?")
      console.log(xPosition, yPosition);
      console.log(this.state);

    });

    _defineProperty(this, "inFocus", (e) => {
      if (document.getElementById('clickbox').contains(e.target)) {
        // nothing
      } else {
        this.props.disableMouseTooltip();
      }
    });

    // 34 todo
    _defineProperty(this, "addListener", () => {
      window.addEventListener('mousemove', this.getTooltipPosition);
      window.addEventListener('activateClickBox', this.updateTooltipPosition);
      window.addEventListener('click', this.inFocus);

      this.setState({
        listenerActive: true
      });
    });



    _defineProperty(this, "removeListener", () => {
      window.removeEventListener('mousemove', this.getTooltipPosition);
      window.removeEventListener('activateClickBox', this.updateTooltipPosition);
      window.removeEventListener('click', this.inFocus);
      // this.setState({
      //   listenerActive: false
      // });
    });
  };

  // run once when the component initializes
  componentDidMount() {
    this.addListener();
  };

  // run once when the component is "unmounted"?
  componentWillUnmount() {
    this.removeListener();
  };

  render() {
    return React.createElement("div", {
      className: this.props.className,
      id: "clickbox",
      style: _objectSpread({
        display: this.props.visible ? 'block' : 'none',
        position: 'fixed',
        top: this.state.yPosition + this.props.offsetY,
        left: this.state.xPosition + this.props.offsetX
        // top: this.props.offsetY,
        // left: this.props.offsetX
      }, this.props.style)
    }, this.props.children);
  }

}

_defineProperty(MouseTooltip, "defaultProps", {
  visible: true,
  offsetX: 100,
  offsetY: 100
});

MouseTooltip.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.node.isRequired,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object // eslint-disable-line react/forbid-prop-types

};
export default MouseTooltip;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Nb3VzZVRvb2x0aXAuanN4Il0sIm5hbWVzIjpbIlJlYWN0IiwiUHJvcFR5cGVzIiwiTW91c2VUb29sdGlwIiwiUHVyZUNvbXBvbmVudCIsInhQb3NpdGlvbiIsInlQb3NpdGlvbiIsIm1vdXNlTW92ZWQiLCJsaXN0ZW5lckFjdGl2ZSIsImNsaWVudFgiLCJjbGllbnRZIiwic2V0U3RhdGUiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0VG9vbHRpcFBvc2l0aW9uIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwicHJvcHMiLCJ2aXNpYmxlIiwiYWRkTGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsImNvbXBvbmVudERpZE1vdW50IiwiY29tcG9uZW50RGlkVXBkYXRlIiwidXBkYXRlTGlzdGVuZXIiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbmRlciIsImNsYXNzTmFtZSIsImRpc3BsYXkiLCJwb3NpdGlvbiIsInRvcCIsIm9mZnNldFkiLCJsZWZ0Iiwib2Zmc2V0WCIsInN0eWxlIiwiY2hpbGRyZW4iLCJwcm9wVHlwZXMiLCJib29sIiwibm9kZSIsImlzUmVxdWlyZWQiLCJudW1iZXIiLCJzdHJpbmciLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QixDLENBQW9DOztBQUVwQyxNQUFNQyxZQUFOLFNBQTJCRixLQUFLLENBQUNHLGFBQWpDLENBQStDO0FBQUE7QUFBQTs7QUFBQSxtQ0FPckM7QUFDTkMsTUFBQUEsU0FBUyxFQUFFLENBREw7QUFFTkMsTUFBQUEsU0FBUyxFQUFFLENBRkw7QUFHTkMsTUFBQUEsVUFBVSxFQUFFLEtBSE47QUFJTkMsTUFBQUEsY0FBYyxFQUFFO0FBSlYsS0FQcUM7O0FBQUEsZ0RBMEJ4QixDQUFDO0FBQUVDLE1BQUFBLE9BQU8sRUFBRUosU0FBWDtBQUFzQkssTUFBQUEsT0FBTyxFQUFFSjtBQUEvQixLQUFELEtBQWdEO0FBQ25FLFdBQUtLLFFBQUwsQ0FBYztBQUNaTixRQUFBQSxTQURZO0FBRVpDLFFBQUFBLFNBRlk7QUFHWkMsUUFBQUEsVUFBVSxFQUFFO0FBSEEsT0FBZDtBQUtELEtBaEM0Qzs7QUFBQSx5Q0FrQy9CLE1BQU07QUFDbEJLLE1BQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsS0FBS0Msa0JBQTFDO0FBQ0EsV0FBS0gsUUFBTCxDQUFjO0FBQUVILFFBQUFBLGNBQWMsRUFBRTtBQUFsQixPQUFkO0FBQ0QsS0FyQzRDOztBQUFBLDRDQXVDNUIsTUFBTTtBQUNyQkksTUFBQUEsTUFBTSxDQUFDRyxtQkFBUCxDQUEyQixXQUEzQixFQUF3QyxLQUFLRCxrQkFBN0M7QUFDQSxXQUFLSCxRQUFMLENBQWM7QUFBRUgsUUFBQUEsY0FBYyxFQUFFO0FBQWxCLE9BQWQ7QUFDRCxLQTFDNEM7O0FBQUEsNENBNEM1QixNQUFNO0FBQ3JCLFVBQUksQ0FBQyxLQUFLUSxLQUFMLENBQVdSLGNBQVosSUFBOEIsS0FBS1MsS0FBTCxDQUFXQyxPQUE3QyxFQUFzRDtBQUNwRCxhQUFLQyxXQUFMO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLSCxLQUFMLENBQVdSLGNBQVgsSUFBNkIsQ0FBQyxLQUFLUyxLQUFMLENBQVdDLE9BQTdDLEVBQXNEO0FBQ3BELGFBQUtFLGNBQUw7QUFDRDtBQUNGLEtBcEQ0QztBQUFBOztBQWM3Q0MsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEIsU0FBS0YsV0FBTDtBQUNEOztBQUVERyxFQUFBQSxrQkFBa0IsR0FBRztBQUNuQixTQUFLQyxjQUFMO0FBQ0Q7O0FBRURDLEVBQUFBLG9CQUFvQixHQUFHO0FBQ3JCLFNBQUtKLGNBQUw7QUFDRDs7QUE4QkRLLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0U7QUFDRSxNQUFBLFNBQVMsRUFBRSxLQUFLUixLQUFMLENBQVdTLFNBRHhCO0FBRUUsTUFBQSxLQUFLO0FBQ0hDLFFBQUFBLE9BQU8sRUFBRSxLQUFLVixLQUFMLENBQVdDLE9BQVgsSUFBc0IsS0FBS0YsS0FBTCxDQUFXVCxVQUFqQyxHQUE4QyxPQUE5QyxHQUF3RCxNQUQ5RDtBQUVIcUIsUUFBQUEsUUFBUSxFQUFFLE9BRlA7QUFHSEMsUUFBQUEsR0FBRyxFQUFFLEtBQUtiLEtBQUwsQ0FBV1YsU0FBWCxHQUF1QixLQUFLVyxLQUFMLENBQVdhLE9BSHBDO0FBSUhDLFFBQUFBLElBQUksRUFBRSxLQUFLZixLQUFMLENBQVdYLFNBQVgsR0FBdUIsS0FBS1ksS0FBTCxDQUFXZTtBQUpyQyxTQUtBLEtBQUtmLEtBQUwsQ0FBV2dCLEtBTFg7QUFGUCxPQVVHLEtBQUtoQixLQUFMLENBQVdpQixRQVZkLENBREY7QUFjRDs7QUFyRTRDOztnQkFBekMvQixZLGtCQUNrQjtBQUNwQmUsRUFBQUEsT0FBTyxFQUFFLElBRFc7QUFFcEJjLEVBQUFBLE9BQU8sRUFBRSxDQUZXO0FBR3BCRixFQUFBQSxPQUFPLEVBQUU7QUFIVyxDOztBQXVFeEIzQixZQUFZLENBQUNnQyxTQUFiLEdBQXlCO0FBQ3ZCakIsRUFBQUEsT0FBTyxFQUFFaEIsU0FBUyxDQUFDa0MsSUFESTtBQUV2QkYsRUFBQUEsUUFBUSxFQUFFaEMsU0FBUyxDQUFDbUMsSUFBVixDQUFlQyxVQUZGO0FBR3ZCTixFQUFBQSxPQUFPLEVBQUU5QixTQUFTLENBQUNxQyxNQUhJO0FBSXZCVCxFQUFBQSxPQUFPLEVBQUU1QixTQUFTLENBQUNxQyxNQUpJO0FBS3ZCYixFQUFBQSxTQUFTLEVBQUV4QixTQUFTLENBQUNzQyxNQUxFO0FBTXZCUCxFQUFBQSxLQUFLLEVBQUUvQixTQUFTLENBQUN1QyxNQU5NLENBTUU7O0FBTkYsQ0FBekI7QUFTQSxlQUFldEMsWUFBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG5jbGFzcyBNb3VzZVRvb2x0aXAgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB2aXNpYmxlOiB0cnVlLFxuICAgIG9mZnNldFg6IDAsXG4gICAgb2Zmc2V0WTogMCxcbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICB4UG9zaXRpb246IDAsXG4gICAgeVBvc2l0aW9uOiAwLFxuICAgIG1vdXNlTW92ZWQ6IGZhbHNlLFxuICAgIGxpc3RlbmVyQWN0aXZlOiBmYWxzZSxcbiAgfTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmFkZExpc3RlbmVyKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVMaXN0ZW5lcigpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigpO1xuICB9XG5cbiAgZ2V0VG9vbHRpcFBvc2l0aW9uID0gKHsgY2xpZW50WDogeFBvc2l0aW9uLCBjbGllbnRZOiB5UG9zaXRpb24gfSkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgeFBvc2l0aW9uLFxuICAgICAgeVBvc2l0aW9uLFxuICAgICAgbW91c2VNb3ZlZDogdHJ1ZSxcbiAgICB9KTtcbiAgfTtcblxuICBhZGRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5nZXRUb29sdGlwUG9zaXRpb24pO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsaXN0ZW5lckFjdGl2ZTogdHJ1ZSB9KTtcbiAgfTtcblxuICByZW1vdmVMaXN0ZW5lciA9ICgpID0+IHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5nZXRUb29sdGlwUG9zaXRpb24pO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsaXN0ZW5lckFjdGl2ZTogZmFsc2UgfSk7XG4gIH07XG5cbiAgdXBkYXRlTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmxpc3RlbmVyQWN0aXZlICYmIHRoaXMucHJvcHMudmlzaWJsZSkge1xuICAgICAgdGhpcy5hZGRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmxpc3RlbmVyQWN0aXZlICYmICF0aGlzLnByb3BzLnZpc2libGUpIHtcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoKTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogdGhpcy5wcm9wcy52aXNpYmxlICYmIHRoaXMuc3RhdGUubW91c2VNb3ZlZCA/ICdibG9jaycgOiAnbm9uZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLnlQb3NpdGlvbiArIHRoaXMucHJvcHMub2Zmc2V0WSxcbiAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnhQb3NpdGlvbiArIHRoaXMucHJvcHMub2Zmc2V0WCxcbiAgICAgICAgICAuLi50aGlzLnByb3BzLnN0eWxlLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTW91c2VUb29sdGlwLnByb3BUeXBlcyA9IHtcbiAgdmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMubm9kZS5pc1JlcXVpcmVkLFxuICBvZmZzZXRYOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvZmZzZXRZOiBQcm9wVHlwZXMubnVtYmVyLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHJlYWN0L2ZvcmJpZC1wcm9wLXR5cGVzXG59O1xuXG5leHBvcnQgZGVmYXVsdCBNb3VzZVRvb2x0aXA7XG4iXX0=