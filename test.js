// ------ game.js
import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this._hp = 100; // 플레이어 체력
    this._str = 50; // 플레이어 공격력
  }

  attack(monster) { // 공격을 했을 때 데미지 만큼 몬스터의 hp를 깎기 위해
    //monser객체에 접근해서 _mhp의 값을 업데이트 해주기 위한 캡슐화

    // 플레이어의 공격
    let damage = Math.floor(Math.random() * this._str); // 스테이지 클리어 마다 랜덤한 공격력 증가를 위한 선언
    monster._mhp -= damage; // monster객체와 상호작용
    return damage;
  }
}

class Monster {
  constructor(stage) {  // 스테이지가 끝날 때 마다 스테이지를 인자로 받는 몬스터가 새로 생성
                        // 해당 스테이지 값을 가져와 몬스터의 피와 데미지 증가
    this._mhp = 100 + stage * 10; // 이제 증가량만 구하면 된다!
    this._mstr = 20 + stage * 2;
  }

  attack(player) { // 플레이어와 동일한 캡슐화

    // 몬스터의 공격
    let mDamage = Math.floor(Math.random() * this._mstr);
    player._hp -= mDamage;
    return mDamage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 HP : ${player._hp} | STR : ${player._str}`,
    ) +
    chalk.redBright(
      `| 몬스터 HP : ${monster._mhp} | STR : ${monster._mstr}`,
    ),
  );
  console.log(chalk.magentaBright(`===========================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player._hp > 0 && monster._mhp > 0) { // 플레이어와 몬스터 둘 중 하나가 HP가 0 이하일 때까지 반복
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격하기 2. 연속 공격 3. 방어하기 4. 도망가기`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    switch(choice) { 
      case '1': // 공격하기 
        logs.push(chalk.green(`공격하기를 선택했다 !`));
        player.attack(monster);
        logs.push(chalk.green(`${player.attack(monster)}의 피해를 입혔다 !`));
        monster.attack(player);
        logs.push(chalk.green(`${monster.attack(player)}의 피해를 입었다 !`));
        break;

      case '2' : // 연속 공격
        logs.push(chalk.green(`연속 공격을 선택했다 !`));
        let i = 0; 
        while (i < Math.floor(Math.random() * 6)) {
          player.attack(monster);
          logs.push(chalk.green(`${player.attack(monster)}의 피해를 입혔다 !`));
          i++;
        }

        logs.push(chalk.green(`${monster.attack(player)}의 피해를 입었다 !`));
        break;

      case '3' : // 방어하기
        logs.push(chalk.green(`${choice} 구현 중 입니다.`));
        break;

      case '4' : // 도망가기
        if (Math.floor(Math.random() * 100) < 50) {
          logs.push(chalk.green(`도망가지 못했다!`));
          break;
        } else if (Math.floor(Math.random() * 100) >= 50) {
          logs.push(chalk.green(`성공적으로 도망갔다!`));
          return true; // true를 반환하면 다음 스테이지로 넘어간다 (왜지? 알아봐야지)
        }

      default : 
        logs.push(chalk.green(`${choice}는 없는 선택지 입니다.`));
        break;
    }

    logs.push(`플레이어 HP: ${player._hp}, 몬스터 HP: ${monster._mhp}`);
  }

  // while문이 끝나면 
  if (player._hp <= 0) {
    console.log(chalk.redBright(`플레이어가 사망했습니다. 게임을 종료합니다.`));
    return false; // 게임 종료
  } else if (monster._mhp <= 0) {
    return true; // 스테이지 클리어
  }

  return true;
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    const result = await battle(stage, player, monster);

    if (!result || player._hp <= 0) {
      break; // 플레이어가 죽었거나 게임 오버일 경우 종료
    }
    console.log(chalk.greenBright(`스테이지 ${stage}을 클리어했습니다!`));
    stage++;
  }

  if (player._hp > 0) { // 플레이어가 마지막 스테이지에서 몬스터를 처치했을 때
    console.log(chalk.greenBright(`축하합니다 ! 모든 스테이지를 클리어했습니다 !`));
  } else {
    console.log(chalk.redBright(`게임을 종료합니다.`));
  }
}