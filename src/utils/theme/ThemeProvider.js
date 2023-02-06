/**
 ** Name: ThemeProvider.js
 ** Author: ZiniSoft Ltd
 ** CreatedAt: 2020
 ** Description: Description of ThemeProvider.js
**/
/* LIBRARY */
import * as React from 'react';
import PropTypes from 'prop-types';

const ThemeContext = React.createContext();

export default class ThemeProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: props.theme,
    };
  }

  updateTheme = (updates) => {
    this.setState(({ theme }) => ({
      theme: [...theme, ...updates],
    }));
  };

  getTheme = () => this.state.theme;

  setTheme = (theme) => {
    this.setState({
      theme,
    });
  };

  /** LIFE CYCLE */
  componentDidUpdate(prevProps) {
    const prevTheme = prevProps.theme;
    const { theme } = this.props;
    if (prevTheme.key !== theme.key) {
      this.setTheme(theme);
    }
  }

  /** RENDER */
  render() {
    return (
      <ThemeContext.Provider
        value={{
          theme: this.state.theme,
          updateTheme: this.updateTheme,
        }}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

ThemeProvider.propTypes = {
  theme: PropTypes.object,
  children: PropTypes.node.isRequired,
};

ThemeProvider.defaultProps = {
  theme: {},
};

export const ThemeConsumer = ThemeContext.Consumer;