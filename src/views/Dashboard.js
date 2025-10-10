import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  useWindowDimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import BoxMatches from '../components/BoxMatches';
import ProductsHome from '../components/ProductsHome';
import NewsHome from '../components/NewsHome';
import useFetchProducts from '../hooks/useFetchProducts';
import useFetchPosts from '../hooks/useFetchPosts';
import CustomText from '../components/atoms/CustomText';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getSubActive } from '../api/subs';
import useCart from '../hooks/useCart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCartLength } from '../store/actions/cartActions';
import { useDispatch } from 'react-redux';


const CarouselImage = ({ uri, title, index, totalDots, excerpt, screenWidth }) => {


  const [loaded, setLoaded] = useState(false);
{/*width: screenWidth, height: 644 */}
  return (
    <View style={{ flex: 1,height: 644, width: screenWidth }}> 
      {!loaded && (
        <View style={styles.imageLoader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <ImageBackground
        source={{ uri }}
        style={{ flex: 1, justifyContent: 'flex-end' }}
        imageStyle={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          opacity: loaded ? 1 : 0,
        }}
        onLoadEnd={() => setLoaded(true)}
      >
        {loaded && (
          <View style={styles.overlay}>
            <CustomText style={styles.title} numberOfLines={1}>{title}</CustomText>
            {/* <HTMLRender
              contentWidth={screenWidth - 140}
              source={{ html: description }}
              tagsStyles={tagStyles}
            />*/}
            <CustomText style={styles.textEcerpt}>{excerpt}</CustomText>
            <View style={styles.dotContainer}>
              {[...Array(totalDots)].map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, index === i && styles.activeDot]}
                />
              ))}
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};
//width: screenWidth, height: 644 
const ManualCarousel = ({ data, tagStyles, onSlidePress, screenWidth }) => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1, height: 644 }} // Adjust height as needed
    >
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          onPress={() => onSlidePress(item)}
        >
          <CarouselImage
            screenWidth={screenWidth}
            excerpt={item.excerpt}
            uri={item.imagepath}
            title={item.title}
            description={item.excerpt}
            index={index}
            totalDots={data.length}
            tagStyles={tagStyles}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [listPosts, setListPosts] = useState([]);
  const [sliderPosts, setSliderPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [storedCartId, setStoredCartId] = useState(null);
  const [shouldFetchCart, setShouldFetchCart] = useState(false);
  const [subActive, setSubActive] = useState(false);


const { prods, refreshProducts } = useFetchProducts({
  ids: null,
  params: {
    idsCategory: [
      '9071b96a-d055-469a-a8ce-93b8c2f07965', // biglietti
      '0f0ff9e1-fe69-4f87-9314-e19764ff2692', // abbonamenti
    ],
  },
});

  const { posts, refreshPosts,
    loading: loadingPosts,
    loadMorePosts,
    isFetchingMore,
    canLoadMore, } = useFetchPosts({ params: { types: ["list", "slider"] } });

  const {height, width} = useWindowDimensions();

  //quando il componente viene montato, recupera l'id del carrello salvato in AsyncStorage
  useEffect(() => {
    const getCartId = async () => {
      const id = await AsyncStorage.getItem('cartId');
      //console.log('Cart ID from AsyncStorage:', id);
      if (id && id !== 'null' && id !== '') {
        setStoredCartId(id);
        setShouldFetchCart(true);
      }
    };
    getCartId();
  }, []);

  const { cartData, refetch, loading: cartLoading } = useCart({
    idcart: shouldFetchCart ? storedCartId : null,
  });

  //gestisci il recupero del carrello quando l'id viene effettivamente caricato dall'async 
  useEffect(() => {
    if (shouldFetchCart && refetch) {
      refetch();
    }
  }, [shouldFetchCart, storedCartId]);

  //setta la la lunghezza del carrello per gestire il badge dell'icona carrello
  useEffect(() => {
    if (cartData?.lineItems) {
      dispatch(setCartLength(cartData.lineItems.length));
    }
  }, [cartData]);


  /*const memoizedTagStyles = useMemo(() => ({
    ...tagsStyles,
    p: { ...tagsStyles.p, color: '#ccc' },
    div: { color: '#ccc' },
    span: { color: '#ccc' },
  }), []);*/

  useEffect(() => {
    refreshPosts();
    refreshProducts();
    //fetch del carrello 
    refetch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchActive = async () => {
        let active = await getSubActive();
        setSubActive(active);
      };
      fetchActive();
    }, [])
  );

  useEffect(() => {
    if (Array.isArray(posts)) {
      const list = [];
      const slider = [];
      posts.forEach(post => {
        if (post.type === 'list') list.push(post);
        else if (post.type === 'slider') slider.push(post);
      });
      setListPosts(list);
      setSliderPosts(slider);
    }
  }, [posts]);


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProducts();
      await refreshPosts();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSlidePress = (post) => {
    navigation.navigate('PostsDetails', { post });
  };

{/*maxWidth: screenWidth*/}
  const renderHeader = () => (
    <View style={{ flex: 1, maxWidth: width}}> 
      {sliderPosts.length > 0 && (
        <ManualCarousel
          data={sliderPosts}
          screenWidth={width}
          //tagStyles={memoizedTagStyles}
          onSlidePress={handleSlidePress}
        />
      )}
      <BoxMatches subActive={subActive} />
      <ProductsHome products={prods} />
      <NewsHome
        styleTitle={{ textAlign: "left", paddingHorizontal: 20, paddingVertical: 30 }}
        styleCards={{ marginHorizontal: 20 }}
        listPosts={listPosts}
        refreshing={loadingPosts}
        onRefresh={refreshPosts}
        onLoadMore={loadMorePosts}
        isFetchingMore={isFetchingMore} />
    </View>
  );

  return (
    <FlatList
      data={[]}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
};

const styles = StyleSheet.create({
  textEcerpt: {
    fontSize: 14,
    color: '#ccc',
    paddingTop: 10
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default Dashboard;
