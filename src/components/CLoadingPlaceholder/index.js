/** LIBRARY */
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { Devices } from '~/config';
import { layoutWidth } from '~/utils/layout_width';

const styles = {
  con_item_placeholder: {
    marginTop: 24 
  }
}

const CLoadingPlaceholder = () => {

  /** RENDER */
  return (
    <ScrollView contentContainerStyle={{
      paddingHorizontal: Devices.pH(layoutWidth.width)
    }}
      showsVerticalScrollIndicator={false}
    >
      <Placeholder style={styles.con_item_placeholder} 
        Animation={Fade}
        Left={PlaceholderMedia}
      >
        <PlaceholderLine width={80} />
        <PlaceholderLine width={90}/>
        <PlaceholderLine width={30} />
      </Placeholder>

      <Placeholder style={styles.con_item_placeholder}
        Animation={Fade}
        Left={PlaceholderMedia}
      >
        <PlaceholderLine width={80} />
        <PlaceholderLine width={90}/>
        <PlaceholderLine width={30} />
      </Placeholder>

      <Placeholder style={styles.con_item_placeholder}
        Animation={Fade}
        Left={PlaceholderMedia}
      >
        <PlaceholderLine width={80} />
        <PlaceholderLine width={90}/>
        <PlaceholderLine width={30} />
      </Placeholder>

      <Placeholder style={styles.con_item_placeholder}
        Animation={Fade}
        Left={PlaceholderMedia}
      >
        <PlaceholderLine width={80} />
        <PlaceholderLine width={90}/>
        <PlaceholderLine width={30} />
      </Placeholder>

      <Placeholder style={styles.con_item_placeholder}
        Animation={Fade}
        Left={PlaceholderMedia}
      >
        <PlaceholderLine width={80} />
        <PlaceholderLine width={90}/>
        <PlaceholderLine width={30} />
      </Placeholder>

      <Placeholder style={styles.con_item_placeholder}
        Animation={Fade}
        Left={PlaceholderMedia}
      >
        <PlaceholderLine width={80} />
        <PlaceholderLine width={90}/>
        <PlaceholderLine width={30} />
      </Placeholder>

      <Placeholder style={styles.con_item_placeholder}
        Animation={Fade}
        Left={PlaceholderMedia}
      >
        <PlaceholderLine width={80} />
        <PlaceholderLine width={90}/>
        <PlaceholderLine width={30} />
      </Placeholder>
    </ScrollView>


  )
}

export default CLoadingPlaceholder;
