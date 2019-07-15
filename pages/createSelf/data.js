/**
 * @module 女生用户回答问题后，答案和衣服的映射关系 
 * @ques1 性格描述 A内向型 B外倾型 C完美型 D和平型
 * @ques2 发型特征描述 A长发 B短发 C双马尾 D丸子头
 * @ques3 日常穿衣风格 A日常风 B学院风 C运动风
 * 
 * @answer 第一个数字表示头发 第二个数字表示衣服 
 */

const femaleAnswerMap = new Map([
  ['AAAAA', 11],
  ['AAAAB', 12],
  ['AAAAC', 13],
  ['AAABA', 41],
  ['AAABB', 42],
  ['AAABC', 43],
  ['AAACA', 21],
  ['AAACB', 22],
  ['AAACC', 23],
  ['AAADA', 31],
  ['AAADB', 32],
  ['AAADC', 33],

  ['AABAA', 15],
  ['AABAB', 12],
  ['AABAC', 13],
  ['AABBA', 45],
  ['AABBB', 42],
  ['AABBC', 43],
  ['AABCA', 25],
  ['AABCB', 22],
  ['AABCC', 23],
  ['AABDA', 35],
  ['AABDB', 32],
  ['AABDC', 33],


  ['ABAAA', 15],
  ['ABAAB', 12],
  ['ABAAC', 13],
  ['ABABA', 55],
  ['ABABB', 52],
  ['ABABC', 53],
  ['ABACA', 25],
  ['ABACB', 22],
  ['ABACC', 23],
  ['ABADA', 35],
  ['ABADB', 32],
  ['ABADC', 33],


  ['ABBAA', 15],
  ['ABBAB', 12],
  ['ABBAC', 13],
  ['ABBBA', 45],
  ['ABBBB', 42],
  ['ABBBC', 43],
  ['ABBCA', 25],
  ['ABBCB', 22],
  ['ABBCC', 23],
  ['ABBDA', 35],
  ['ABBDB', 32],
  ['ABBDC', 33],


  ['BAAAA', 11],
  ['BAAAB', 12],
  ['BAAAC', 13],
  ['BAABA', 51],
  ['BAABB', 52],
  ['BAABC', 53],
  ['BAACA', 21],
  ['BAACB', 22],
  ['BAACC', 23],
  ['BAACC', 23],
  ['BAADA', 31],
  ['BAADB', 32],
  ['BAADC', 33],


  ['BABAA', 11],
  ['BABAB', 12],
  ['BABAC', 13],
  ['BABBA', 41],
  ['BABBB', 42],
  ['BABBC', 43],
  ['BABCA', 21],
  ['BABCB', 22],
  ['BABCC', 23],
  ['BABDA', 31],
  ['BABDB', 32],
  ['BABDC', 33],


  ['BBAAA', 11],
  ['BBAAB', 12],
  ['BBAAC', 13],
  ['BBABA', 51],
  ['BBABB', 52],
  ['BBABC', 53],
  ['BBACA', 21],
  ['BBACB', 22],
  ['BBACC', 23],
  ['BBADA', 31],
  ['BBADB', 32],
  ['BBADC', 33],

  ['BBBAA', 15],
  ['BBBAB', 12],
  ['BBBAC', 13],
  ['BBBBA', 55],
  ['BBBBB', 52],
  ['BBBBC', 53],
  ['BBBCA', 25],
  ['BBBCB', 22],
  ['BBBCC', 23],
  ['BBBDA', 35],
  ['BBBDB', 32],
  ['BBBDC', 33],
])

/**
 * @module 男生用户回答问题后，答案和衣服的映射关系 
 * @ques1 性格描述 A内向型 B外倾型 C完美型 D和平型
 * @ques2 发型特征描述 A寸头 B短发 C中短发 
 * @ques3 日常穿衣风格 A日常风 B学院风 C运动风
 * 
 * @answer 第一个数字表示头发 第二个数字表示衣服 
 */

const maleAnswerMap = new Map([
  ['AAAAA', 11],
  ['AAAAB', 12],
  ['AAAAC', 13],
  ['AAABA', 41],
  ['AAABB', 42],
  ['AAABC', 43],
  ['AAACA', 21],
  ['AAACB', 22],
  ['AAACC', 23],
  ['AAADA', 31],
  ['AAADB', 32],
  ['AAADC', 33],

  ['AABAA', 15],
  ['AABAB', 12],
  ['AABAC', 13],
  ['AABBA', 45],
  ['AABBB', 42],
  ['AABBC', 43],
  ['AABCA', 25],
  ['AABCB', 22],
  ['AABCC', 23],
  ['AABDA', 35],
  ['AABDB', 32],
  ['AABDC', 33],


  ['ABAAA', 15],
  ['ABAAB', 12],
  ['ABAAC', 13],
  ['ABABA', 55],
  ['ABABB', 52],
  ['ABABC', 53],
  ['ABACA', 25],
  ['ABACB', 22],
  ['ABACC', 23],
  ['ABADA', 35],
  ['ABADB', 32],
  ['ABADC', 33],


  ['ABBAA', 15],
  ['ABBAB', 12],
  ['ABBAC', 13],
  ['ABBBA', 45],
  ['ABBBB', 42],
  ['ABBBC', 43],
  ['ABBCA', 25],
  ['ABBCB', 22],
  ['ABBCC', 23],
  ['ABBDA', 35],
  ['ABBDB', 32],
  ['ABBDC', 33],


  ['BAAAA', 11],
  ['BAAAB', 12],
  ['BAAAC', 13],
  ['BAABA', 51],
  ['BAABB', 52],
  ['BAABC', 53],
  ['BAACA', 21],
  ['BAACB', 22],
  ['BAACC', 23],
  ['BAACC', 23],
  ['BAADA', 31],
  ['BAADB', 32],
  ['BAADC', 33],


  ['BABAA', 11],
  ['BABAB', 12],
  ['BABAC', 13],
  ['BABBA', 41],
  ['BABBB', 42],
  ['BABBC', 43],
  ['BABCA', 21],
  ['BABCB', 22],
  ['BABCC', 23],
  ['BABDA', 31],
  ['BABDB', 32],
  ['BABDC', 33],


  ['BBAAA', 11],
  ['BBAAB', 12],
  ['BBAAC', 13],
  ['BBABA', 51],
  ['BBABB', 52],
  ['BBABC', 53],
  ['BBACA', 21],
  ['BBACB', 22],
  ['BBACC', 23],
  ['BBADA', 31],
  ['BBADB', 32],
  ['BBADC', 33],

  ['BBBAA', 15],
  ['BBBAB', 12],
  ['BBBAC', 13],
  ['BBBBA', 55],
  ['BBBBB', 52],
  ['BBBBC', 53],
  ['BBBCA', 25],
  ['BBBCB', 22],
  ['BBBCC', 23],
  ['BBBDA', 35],
  ['BBBDB', 32],
  ['BBBDC', 33],
])

const femaleQues = [
  {
    ques: '/images/question1.png',
    answerList: [
      {
        name: `内向型`,
        value: 'A',
      },
      {
        name: `外倾型`,
        value: 'B',
      },
      {
        name: `完美型`,
        value: 'C',
      },
      {
        name: `和平型`,
        value: 'D',
      }
    ]
  },
  {
    ques: `/images/question2.png`,
    answerList: [
      {
        name: `长 发`,
        value: 'A',
      },
      {
        name: `短 发`,
        value: 'B',
      },
      {
        name: `双马尾`,
        value: 'C',
      },
      {
        name: `丸子头`,
        value: 'D',
      }
    ]
  },
  {
    ques: `/images/question3.png`,
    answerList: [
      {
        name: `日常风`,
        value: 'A',
      },
      {
        name: `学院风`,
        value: 'B',
      },
      {
        name: `运动风`,
        value: 'C',
      }
    ]
  }
];

const maleQues = [
  {
    ques: '/images/question1.png',
    answerList: [
      {
        name: `内向型`,
        value: 'A',
      },
      {
        name: `外倾型`,
        value: 'B',
      },
      {
        name: `完美型`,
        value: 'C',
      },
      {
        name: `和平型`,
        value: 'D',
      }
    ]
  },
  {
    ques: `/images/question2.png`,
    answerList: [
      {
        name: `寸 发`,
        value: 'A',
      },
      {
        name: `短 发`,
        value: 'B',
      },
      {
        name: `长发`,
        value: 'C',
      },
    ]
  },
  {
    ques: `/images/question3.png`,
    answerList: [
      {
        name: `日常风`,
        value: 'A',
      },
      {
        name: `学院风`,
        value: 'B',
      },
      {
        name: `运动风`,
        value: 'C',
      }
    ]
  }
]



export {
  femaleAnswerMap,
  maleAnswerMap,
  femaleQues,
  maleQues,
}