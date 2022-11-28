/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @iceworks/best-practices/recommend-functional-component */
import Trigger from 'rc-trigger';
import DropdownMenu from './DropdownMenu';
import type { DataDrivenOptionProps } from './Option';
import type { Placement, Direction } from './Complete';
import React from 'react';

const BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  bottomLeft: {
    points: ['tr', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['br', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
};

interface KeywordTriggerProps {
  options: DataDrivenOptionProps[];
  placement?: Placement;
  direction?: Direction;
  visible?: boolean;
  children?: React.ReactElement;
  getPopupContainer?: () => HTMLElement;
  dropdownClassName?: string;
  transitionName?: string;
}
class KeywordTrigger extends React.Component<KeywordTriggerProps, {}> {
  public getDropdownElement = () => {
    const { options } = this.props;
    return <DropdownMenu options={options} />;
  };

  public getDropdownPlacement = () => {
    const { placement, direction } = this.props;
    let popupPlacement;
    if (direction === 'rtl') {
      popupPlacement = placement === 'top' ? 'topLeft' : 'bottomLeft';
    } else {
      popupPlacement = placement === 'top' ? 'topRight' : 'bottomRight';
    }
    return popupPlacement;
  };

  public render() {
    const { children, visible, transitionName, getPopupContainer } = this.props;
    const popupElement = this.getDropdownElement();
    return (
      <Trigger
        popupVisible={visible}
        popup={popupElement}
        popupPlacement={this.getDropdownPlacement()}
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupTransitionName={transitionName}
        getPopupContainer={getPopupContainer}
        popupClassName={this.props.dropdownClassName}
      >
        {children as React.ReactElement}
      </Trigger>
    );
  }
}

export default KeywordTrigger;
