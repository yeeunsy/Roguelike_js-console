import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100; // 플레이어의 초기 HP 설정
    this.attackPower = 10; // 플레이어의 공격력 설정
    this.carrots = 0; // 플레이어가 가진 당근 수
    this.level = 1; // 플레이어의 초기 레벨 설정
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * this.attackPower) + 1; // 1부터 공격력 사이의 랜덤한 피해
    monster.hp -= damage; // 몬스터의 HP에서 랜덤 피해량만큼 빼기
    console.log(chalk.yellow(`몬스터를 공격하여 ${damage}의 피해를 입혔습니다!`));
  }

  continuousAttack(monster) {
    const hits = Math.floor(Math.random() * 5) + 1; // 1부터 5 사이의 랜덤한 공격 횟수
    for (let i = 0; i < hits; i++) {
      if (monster.hp > 0) {
        this.attack(monster);
      }
    }

    if (monster.hp > 0) {
      monster.attack(this); // 몬스터가 살아있다면 플레이어가 공격을 당함
    }
  }

  defend(monster) {
    const defendSuccess = Math.random() < 0.5; // 50% 확률로 방어 성공
    if (defendSuccess) {
      const reducedDamage = Math.floor(monster.attackPower * 0.2); // 방어 성공 시 80%의 피해 감소
      this.hp -= reducedDamage;
      console.log(chalk.blue(`방어에 성공하여 ${reducedDamage}의 피해만 입었습니다!`));
    } else {
      this.hp -= monster.attackPower; // 방어 실패 시 몬스터의 공격력만큼 피해
      console.log(chalk.red(`방어에 실패하여 ${monster.attackPower}의 피해를 입었습니다!`));
    }
  }

  runAway(stage) {
    console.log(chalk.yellow('도망 중...'));
    const runChoice = readlineSync.question('마을로 도망가시겠습니까? (y/n): ');

    if (runChoice.toLowerCase() === 'y') {
      console.log(chalk.green(`스테이지 ${stage}를 클리어하고 마을로 돌아갑니다.`));
      this.enterVillage(stage);
      return true; // 도망 성공
    } else {
      console.log(chalk.red('도망치지 않았습니다. 스테이지를 계속 진행합니다.'));
      return false; // 도망 실패
    }
  }

  enterVillage(stage) {
    console.log(chalk.green(`마을에 도착했습니다. 스테이지 ${stage}의 정보를 저장합니다.`));
    
    let inVillage = true;
    while (inVillage) {
      console.log(chalk.green('\n1. 강화하기 2. 다음 스테이지로 이동 3. 마을에서 나가기'));
      const villageChoice = readlineSync.question('무엇을 하시겠습니까? ');

      switch (villageChoice) {
        case '1':
          this.strengthen();
          break;
        case '2':
          inVillage = false; // 마을을 떠나 다음 스테이지로 이동
          break;
        case '3':
          console.log(chalk.blue('마을을 떠납니다.'));
          inVillage = false;
          break;
        default:
          console.log(chalk.red('잘못된 선택입니다.'));
      }
    }
  }

  strengthen() {
    const cost = this.level * 2; // 강화 비용: 레벨 * 2 당근
    if (this.carrots >= cost) {
      this.carrots -= cost;
      this.attackPower += this.attackPower * 0.03; // 공격력 3% 증가
      this.level++;
      console.log(chalk.green(`강화 성공! 공격력이 ${this.attackPower.toFixed(2)}로 증가했습니다. 현재 레벨: ${this.level}`));
    } else {
      console.log(chalk.red('당근이 부족합니다.'));
    }
  }

  heal() {
    const maxHealth = 100;
    const missingHealth = maxHealth - this.hp;
    const healAmount = Math.floor(missingHealth * (Math.random() * 0.5 + 0.5)); // 50% ~ 100% 사이의 랜덤한 회복량
    this.hp = Math.min(this.hp + healAmount, maxHealth); // 최대 체력을 넘지 않도록 회복
    console.log(chalk.green(`체력을 ${healAmount}만큼 회복했습니다! 현재 체력: ${this.hp}`));
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + stage * 2; // 스테이지에 따라 몬스터 HP 증가
    this.attackPower = 10 + stage * 2; // 스테이지에 따라 몬스터 공격력 증가
  }

  attack(player) {
    player.hp -= this.attackPower;
    console.log(chalk.red(`몬스터가 공격하여 ${this.attackPower}의 피해를 입혔습니다!`));
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== 현재 상태 ===`));
  console.log(chalk.cyanBright(`| 스테이지: ${stage}`) + chalk.blueBright(` | 플레이어 체력: ${player.hp}, 공격력: ${player.attackPower.toFixed(2)}`) + chalk.redBright(` | 몬스터 체력: ${monster.hp}, 공격력: ${monster.attackPower} |`));
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) { // 둘 중 하나의 HP가 0이 될 때까지 전투
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green('\n1. 공격 2. 연속 공격 3. 방어 4. 도망'));
    const choice = readlineSync.question('어떤 행동을 선택하시겠습니까? ');

    switch (choice) {
      case '1':
        player.attack(monster);
        logs.push(chalk.green('선택한 행동: 공격'));
        break;
      case '2':
        player.continuousAttack(monster);
        logs.push(chalk.green('선택한 행동: 연속 공격'));
        break;
      case '3':
        player.defend(monster);
        logs.push(chalk.green('선택한 행동: 방어'));
        break;
      case '4':
        if (player.runAway(stage)) {
          return; // 도망에 성공하면 전투 종료
        }
        logs.push(chalk.green('선택한 행동: 도망'));
        break;
      default:
        console.log(chalk.red('잘못된 선택입니다.'));
    }

    if (monster.hp > 0) {
      monster.attack(player); // 몬스터의 반격
    }
  }

  if (player.hp > 0) {
    const carrotsGained = Math.floor(Math.random() * 5) + 1;
    player.carrots += carrotsGained;
    console.log(chalk.green(`스테이지 ${stage} 클리어! ${carrotsGained}개의 당근을 획득했습니다.`));

    player.heal(); // 스테이지 클리어 시 회복

    const enterVillageChoice = readlineSync.question('마을로 들어가시겠습니까? (y/n): ');

    if (enterVillageChoice.toLowerCase() === 'y') {
      player.enterVillage(stage);
    }
  } else {
    console.log(chalk.red('플레이어가 패배했습니다.'));
  }
};

export async function startGame() {
  console.clear();
  console.log(chalk.yellow('게임에 오신 것을 환영합니다!')); // 게임 시작 인트로 메시지
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    if (player.hp <= 0) {
      console.log(chalk.red('게임 오버!'));
      break; // 플레이어가 패배하면 게임 종료
    }

    stage++;
  }

  if (stage > 10) {
    console.log(chalk.green('모든 스테이지를 클리어했습니다! 축하합니다!'));
  }
}