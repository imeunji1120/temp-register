// - 과일을 선택하는 select tag 구현
// - 선택한 과일을 화면에서 표출
// - 과일을 선택하는 selector를 숨기고 싶어
'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css'; // CSS 모듈 임포트

export default function Fruits() {
  const [fruits, setFruits] = useState([
    { id: 1, name: "Apple", src: "/img/apple.jpg", quantity: 1 },
    { id: 2, name: "Banana", src: "/img/banana.jpg", quantity: 1 },
    { id: 3, name: "Orange", src: "/img/orange.jpg", quantity: 1 },
    { id: 4, name: "Grape", src: "/img/grape.jpg", quantity: 1 }
  ]);

  const [selectedFruit, setSelectedFruit] = useState('');
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility
  const [cart, setCart] = useState([]);

  const fruitInputRef = useRef(null);

  // 컴포넌트 마운트 시 localStorage에서 과일 로드
  useEffect(() => {
    const storedFruits = JSON.parse(localStorage.getItem('fruits')) || [];
    if (storedFruits.length) setFruits(storedFruits);
  }, []);

  // '과일' 상태가 변경될 때마다 localStorage에 과일 저장
  useEffect(() => {
    localStorage.setItem('fruits', JSON.stringify(fruits));
  }, [fruits]);

  // 과일 선택 창 숨기기/보이기 토글
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // 선택한 과일을 장바구니에 추가
  const addToCart = (id) => {
    if (id) {
      const selected = fruits.find(fruit => fruit.id === id);
      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setCart([...cart, { ...selected, quantity: 1 }]);
      }
    }
  };

  // 장바구니에서 과일 수량 줄이기
  const removeFromCart = (id) => {
    const updatedCart = cart.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0);
    setCart(updatedCart);
  };

  // 장바구니에서 과일 수량 늘리기
  const increaseQuantity = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  // 새로운 과일 추가
  const handleAddFruit = () => {
    const newFruitName = fruitInputRef.current.value;
    if (newFruitName.trim() !== '') {
      const nextId = fruits.length > 0 ? fruits[fruits.length - 1].id + 1 : 1;
      const newFruit = {
        id: nextId,
        name: newFruitName,
        src: `/img/${newFruitName.toLowerCase()}.jpg`,
        quantity: 1
      };
      setFruits([...fruits, newFruit]);
      fruitInputRef.current.value = ''; // 입력 필드 초기화
    }
  };

  // 과일 삭제
  const handleDeleteFruit = (id) => {
    const updatedFruits = fruits.filter(fruit => fruit.id !== id);
    setFruits(updatedFruits);
    // 삭제된 과일이 선택된 경우 선택 지우기
    if (selectedFruit === id) {
      setSelectedFruit('');
    }
  };

  return (
    <div className={styles.container}>
      <h2>과일 선택하기</h2>
      <button className={styles.button} onClick={toggleVisibility}>
        {isVisible ? '선택 숨기기' : '선택 보이기'}
      </button>
      {isVisible && ( // Conditional rendering based on isVisible state
        <div>
          <select className={styles.select} onChange={(e) => setSelectedFruit(parseInt(e.target.value))}>
            <option value="">과일 선택</option>
            {fruits.map((fruit) => (
              <option key={fruit.id} value={fruit.id}>
                {fruit.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <hr />
      <p className={styles.fruits}>선택한 과일: {selectedFruit ? fruits.find(fruit => fruit.id === selectedFruit).name : ''}</p>
      {selectedFruit && (
        <Image
          src={fruits.find(fruit => fruit.id === selectedFruit).src}
          alt={fruits.find(fruit => fruit.id === selectedFruit).name}
          width={150}
          height={150}
        />
      )}
      <br />
      <button className={styles.button} onClick={() => addToCart(selectedFruit)}>장바구니 담기</button>
      <hr />
      <h2>장바구니</h2>
      <ul className={styles.ul}>
        {cart.map(item => (
          <li key={item.id}>
            <Image
              src={item.src}
              alt={item.name}
              width={50}
              height={50}
            />
            {item.name}
            <button className={styles.button} onClick={() => removeFromCart(item.id)}>-</button>
            {item.quantity}
            <button className={styles.button} onClick={() => increaseQuantity(item.id)}>+</button>
          </li>
        ))}
      </ul>
      <hr />
      <h2 className={styles.h2}>관리자 페이지 : 과일 추가 / 삭제하기</h2>
      <div>
        <input type="text" className={styles.input} placeholder="과일 이름" ref={fruitInputRef} />
        <button className={styles.button} onClick={handleAddFruit}>과일 추가</button>
      </div>
      <ul className={styles.ul}>
        {fruits.map(fruit => (
          <li key={fruit.id}>
            {fruit.name}
            <button className={styles.button} onClick={() => handleDeleteFruit(fruit.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
