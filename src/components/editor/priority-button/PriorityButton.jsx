"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require('react');
var classnames_1 = require('classnames');
var consts_1 = require('../../consts');
var semantic_ui_react_1 = require('semantic-ui-react');
var PriorityButton_scss_1 = require('./PriorityButton.scss');
var PriorityButton = (function (_super) {
    __extends(PriorityButton, _super);
    function PriorityButton() {
        var _this = this;
        _super.apply(this, arguments);
        this.priorities = (_a = {},
            _a[consts_1.AnnotationPriorities.NORMAL] = PriorityButton_scss_1.default.normal,
            _a[consts_1.AnnotationPriorities.WARNING] = PriorityButton_scss_1.default.warning,
            _a[consts_1.AnnotationPriorities.ALERT] = PriorityButton_scss_1.default.alert,
            _a
        );
        this.handleClick = function () {
            var _a = _this.props, type = _a.type, onClick = _a.onClick;
            onClick(type);
        };
        var _a;
    }
    PriorityButton.prototype.render = function () {
        var _a = this.props, type = _a.type, priority = _a.priority, children = _a.children, tooltipText = _a.tooltipText;
        var selected = priority === type;
        var style = this.priorities[type];
        var button = (<button className={classnames_1.default(PriorityButton_scss_1.default.self, style, (_b = {}, _b[PriorityButton_scss_1.default.selected] = selected, _b))} onClick={this.handleClick}>
        {children}
      </button>);
        return (<semantic_ui_react_1.Popup trigger={button} size="small" className="pp-ui small-padding single-long-line" inverted={false}>
        {tooltipText}
      </semantic_ui_react_1.Popup>);
        var _b;
    };
    PriorityButton.defaultProps = {
        selected: false,
        className: '',
    };
    return PriorityButton;
}(react_1.PureComponent));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PriorityButton;
