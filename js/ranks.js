const RANKS = {
    names: ['rank', 'tier', 'tetr', 'pent', 'hex'],
    fullNames: ['级别', '阶层', '四重阶层', '五重阶层', '六重阶层'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
            if (tmp.chal14comp || tmp.inf_unl) reset = false
            else if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()

            addQuote(1)
        }
    },
    bulk(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].max(tmp.ranks[type].bulk.max(player.ranks[type].add(1)))
            let reset = true
            if (tmp.chal14comp || tmp.inf_unl) reset = false
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    unl: {
        tier() { return player.ranks.rank.gte(3) || player.ranks.tier.gte(1) || player.mainUpg.atom.includes(3) || tmp.radiation.unl || tmp.inf_unl },
        tetr() { return player.mainUpg.atom.includes(3) || tmp.radiation.unl || tmp.inf_unl },
        pent() { return tmp.radiation.unl || tmp.inf_unl },
        hex() { return tmp.chal13comp || tmp.inf_unl },
    },
    doReset: {
        rank() {
            player.mass = E(1)
            for (let x = 1; x <= UPGS.mass.cols; x++) BUILDINGS.reset("mass_"+x)
            if(player.massGain<=(1e-10))player.mass = E(0)
        },
        tier() {
            player.ranks.rank = E(0)
            this.rank()
        },
        tetr() {
            player.ranks.tier = E(0)
            this.tier()
        },
        pent() {
            player.ranks.tetr = E(0)
            this.tetr()
        },
        hex() {
            player.ranks.pent = E(0)
            this.pent()
        },
    },
    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return player.mainUpg.rp.includes(5) || tmp.inf_unl },
        tier() { return player.mainUpg.rp.includes(6) || tmp.inf_unl },
        tetr() { return player.mainUpg.atom.includes(5) || tmp.inf_unl },
        pent() { return hasTree("qol8") || tmp.inf_unl },
        hex() { return true },
    },
    desc: {
        rank: {
            '1': "解锁质量升级1。",
            '2': "解锁质量升级2，使质量升级1的花费折算弱化30%。",
            '3': "解锁质量升级3，使质量升级2的花费折算弱化30%，质量升级1的效果对自身生效。",
            '4': "使质量升级3的花费折算弱化20%。",
            '5': "使质量升级2的效果对自身生效。",
            '6': "使质量获取速度乘以(级别+1)的平方。",
            '13': "使质量获取速度变为原来的3倍。",
            '14': "使级别5的效果翻倍。",
            '17': "使级别6的奖励公式变得更好。即原公式的指数从2变为级别的1/3次方。",
            '34': "使质量升级3的软上限延迟1.2倍出现。",
            '37': "基于级别的数值，增加时间速度倍率。",
            '40': "使级别可以加成狂怒能量获取速度。",
            '90': "使级别40的奖励变得更好。",
            '180': "使质量获取速度变为原来的1.025次方。",
            '220': "使级别40的奖励变得滥强。",
            '300': "使级别可以加成夸克获取速度。",
            '380': "使级别可以加成质量获取速度。",
            '800': "基于级别的数值，使质量获取速度的软上限弱化0.25%，硬上限为25%。",
        },
        tier: {
            '1': "使级别的需求减少20%。",
            '2': "使质量获取速度变为原来的1.15次方。",
            '3': "使所有质量升级的花费折算弱化22.5%。",
            '4': "使质量获取速度变为原来的1.05次方。",
            '5': "每有1个阶层，时间速度倍率就增加10%。",
            '6': "使阶层可以加成狂怒能量。",
            '7': "使质量可以加成它本身和狂怒能量获取。",
            '8': "使阶层6的奖励效果基于暗物质的数值变得更强。",
            '12': "使阶层4的奖励效果翻倍。",
            '30': "使强化器效果的软上限弱化10%。",
            '55': "使级别380的效果基于阶层的数值变得更强。",
            '100': "使四重阶层的超级折算延迟5次出现。",
        },
        tetr: {
            '1': "使阶层的需求减少25%，级别的究极折算弱化15%。",
            '2': "使质量升级3的效果对自身生效。",
            '3': "使时间速度效果变为原来的1.05次方。",
            '4': "使级别的超级折算基于阶层的数值而弱化，阶层的超级折算弱化20%。",
            '5': "使时间速度的究极折算和超究折算基于四重阶层的数值而延迟出现。",
            '8': "使质量获取速度的二重软上限延迟1.5次方出现。",
        },
        pent: {
            '1': "使四重阶层的需求减少15%，级别的元折算延迟1.1倍出现。",
            '2': "使四重阶层可以加成射线的获取速度。",
            '4': "使时间速度的元折算基于超新星次数而延迟出现。",
            '5': "使级别的元折算基于五重阶层的数值而延迟出现。",
            '8': "使质量获取速度的四重软上限基于五重阶层的数值而延迟出现。",
            '15': "移除强化器效果的三重软上限。",
        },
        hex: {
            '1': "使五重阶层的需求减少20%。",
            '4': "每个六重阶层使暗射线获取速度增加20%。",
            '6': "移除质量获取速度的一重软上限。",
            '10': "移除质量获取速度的二重软上限。",
            '13': "移除质量获取速度的三重软上限。",
            '17': "移除质量获取速度的四重软上限。",
            '36': "移除质量获取速度的五重软上限。",
            '43': "使六重阶层4的效果变得滥强。",
            '48': "移除质量获取速度的六重软上限。",
            '62': "移除质量获取速度的七重软上限。",
            '91': "使物质的指数增加0.15。",
            '157': "移除质量获取速度的八重软上限。",
        },
    },
    effect: {
        rank: {
            '3'() {
                let ret = player.build.mass_1.amt
                return ret
            },
            '5'() {
                let ret = player.build.mass_2.amt.div(40)
                if (player.ranks.rank.gte(14)) ret = ret.mul(2)
                return ret    
            },
            '6'() {
                let ret = player.ranks.rank.add(1).pow(player.ranks.rank.gte(17)?player.ranks.rank.add(1).root(3):2)
                return ret
            },
            '37'() {
                let ret = player.ranks.rank.div(100)
                if (player.ranks.rank.gte(90)) ret = player.ranks.rank.div(10)
                if (player.ranks.rank.gte(220)) ret = player.ranks.rank
                return ret
            },
            '40'() {
                let ret = player.ranks.rank.add(1).pow(1.5)
                return ret
            },
            '300'() {
                let ret = player.ranks.rank.add(1)
                return ret
            },
            '380'() {
                let ret = E(10).pow(player.ranks.rank.sub(379).pow(1.5).pow(player.ranks.tier.gte(55)?RANKS.effect.tier[55]():1).softcap(1000,0.5,0))
                return ret
            },
            '800'() {
                let ret = E(1).sub(player.ranks.rank.sub(799).mul(0.0025).add(1).softcap(1.25,0.5,0).sub(1)).max(0.75)
                return ret
            },
        },
        tier: {
            '5'() {
                let ret = E(0)
                if (player.ranks.tier.gte(12)) ret = E(1.2).pow(player.ranks.tier).sub(1)
                else ret = E(1.1).pow(player.ranks.tier).sub(1)
                return ret
            },
            '6'() {
                let ret = E(2).pow(player.ranks.tier)
                if (player.ranks.tier.gte(8)) ret = ret.pow(RANKS.effect.tier[8]())
                return overflow(ret,'ee100',0.5).overflow('ee40000',0.25,2)
            },
            '7'() {
                let ret = E(player.mass).pow(player.mass).add(1)
                return ret
            },
            '8'() {
                let ret = player.bh.dm.max(1).log10().add(1).root(2)
                return ret.overflow('ee5',0.5)
            },
            '55'() {
                let ret = player.ranks.tier.max(1).log10().add(1).root(4)
                return ret
            },
        },
        tetr: {
            '2'() {
                let ret = player.build.mass_3.amt.div(400)
                if (ret.gte(1) && hasPrestige(0,15)) ret = ret.pow(1.5)
                return ret
            },
            '4'() {
                let ret = E(0.96).pow(player.ranks.tier.pow(1/3))
                return ret
            },
            '5'() {
                let ret = player.ranks.tetr.pow(4).softcap(1000,0.25,0)
                return ret
            },
        },
        pent: {
            '2'() {
                let ret = E(1.3).pow(player.ranks.tetr.softcap(12e10,0.1,0))
                return ret
            },
            '4'() {
                let ret = player.supernova.times.add(1).root(5)
                return ret
            },
            '5'() {
                let ret = E(1.05).pow(player.ranks.pent.min(1500))
                return ret
            },
            '8'() {
                let ret = E(1.1).pow(player.ranks.pent)
                return ret
            },
        },
        hex: {
            '4'() {
                let hex = player.ranks.hex
                let ret = hex.mul(.2).add(1)
                if (hex.gte(43)) ret = ret.pow(hex.min(1e18).div(10).add(1).root(2))
                return overflow(ret,1e11,0.5)
            },
        },
    },
    effDesc: {
        rank: {
            3(x) { return "+"+format(x) },
            5(x) { return "+"+format(x) },
            6(x) { return format(x)+"倍" },
            37(x) {  return "+"+format(x.mul(100))+"%" },
            40(x) { return format(x)+"倍" },
            300(x) { return format(x)+"倍" },
            380(x) { return format(x)+"倍" },
            800(x) { return "弱化"+format(E(1).sub(x).mul(100))+"%" },
        },
        tier: {
            5(x) { return "+"+format(x.mul(100))+"%" },
            6(x) { return format(x)+"倍" },
            7(x) { return format(x)+"倍" },
            8(x) { return "^"+format(x) },
            55(x) { return "^"+format(x) },
        },
        tetr: {
            2(x) { return "+"+format(x) },
            4(x) { return "弱化"+format(E(1).sub(x).mul(100))+"%" },
            5(x) { return "延迟"+format(x,0)+"次出现" },
        },
        pent: {
            2(x) { return format(x)+"倍" },
            4(x) { return "延迟"+format(x)+"倍出现" },
            5(x) { return "延迟"+format(x)+"倍出现" },
            8(x) { return "延迟"+format(x)+"次方出现" },
        },
        hex: {
            4(x) { return format(x,1)+"倍" },
        },
    },
    fp: {
        rank() {
            let f = E(1)
            if (player.ranks.tier.gte(1)) f = f.mul(1/0.775)
            if (hasUpgrade("rp",4)) f = f.mul(1/0.985) 
            if (hasUpgrade("rp",6)) f = f.mul(1/0.95)       
            if (!hasCharger(3)) f = f.mul(tmp.chal.eff[5].pow(-1))
            return f
        },
        tier() {
            let f = E(1)
            f = f.mul(tmp.fermions.effs[1][3])
            if (player.ranks.tetr.gte(1)) f = f.mul(1/0.75)
            if (player.mainUpg.atom.includes(10)) f = f.mul(2)
            if (hasUpgrade("rp",6)) f = f.mul(1/0.9)           
            return f
        },
    },
}

const CORRUPTED_PRES = [
    [10,40],
]

const PRESTIGES = {
    names: ['prestige','honor','glory','renown','valor'],
    fullNames: ["转生等级", "荣耀", '赞颂', '名望', '英勇'],
    baseExponent() {
        let x = E(0)

        if (hasElement(100)) x = x.add(tmp.elements.effect[100])
        if (hasPrestige(0,32)) x = x.add(prestigeEff(0,32,0))
        x = x.add(tmp.fermions.effs[1][6]||0).add(glyphUpgEff(10,0))
        if (tmp.inf_unl) x = x.add(theoremEff('mass',3,0))

        x = x.add(1)

        if (hasBeyondRank(4,2)) x = x.mul(beyondRankEffect(4,2))
        if (hasAscension(1,1)) x = x.mul(2)

        if (tmp.c16active || inDarkRun()) x = x.div(mgEff(5))

        return x.overflow(2e4,0.5)
    },
    base() {
        let x = E(1)

        for (let i = 0; i < RANKS.names.length; i++) {
            let r = player.ranks[RANKS.names[i]]
            if (hasPrestige(0,18) && i == 0) r = r.mul(2)
            x = x.mul(r.add(1))
        }

        if (tmp.dark.abEff.pb) x = x.mul(tmp.dark.abEff.pb)

        if (hasBeyondRank(2,1)) x = x.mul(beyondRankEffect(2,1))

        return x.sub(1)
    },
    req(i) {
        let x = EINF, fp = this.fp(i), y = player.prestiges[i]
        switch (i) {
            case 0:
                x = Decimal.pow(1.1,y.scaleEvery('prestige0',false,[0,0,0,fp]).pow(1.1)).mul(2e13)
                break;
            case 1:
                x = y.div(fp).scaleEvery('prestige1',false).pow(1.25).mul(3).add(4)
                break;
            case 2:
                x = hasElement(167)?y.div(fp).scaleEvery('prestige2',false).pow(1.25).mul(3.5).add(5):y.pow(1.3).mul(4).add(6)
                break;
            case 3:
                x = y.scaleEvery('prestige3',false,[0,fp]).pow(1.25).mul(3).add(9)
                break;
            case 4:
                x = y.div(fp).scaleEvery('prestige4',false).pow(1.25).mul(4).add(20)
                break;
            default:
                x = EINF
                break;
        }
        return x.ceil()
    },
    bulk(i) {
        let x = E(0), y = i==0?tmp.prestiges.base:player.prestiges[i-1], fp = this.fp(i)
        switch (i) {
            case 0:
                if (y.gte(2e13)) x = y.div(2e13).max(1).log(1.1).max(0).root(1.1).scaleEvery('prestige0',true,[0,0,0,fp]).add(1)
                break;
            case 1:
                if (y.gte(4)) x = y.sub(4).div(3).max(0).root(1.25).scaleEvery('prestige1',true).mul(fp).add(1)
                break
            case 2:
                if (y.gte(6)) x = hasElement(167)?y.sub(5).div(3.5).max(0).root(1.25).scaleEvery('prestige2',true).mul(fp).add(1):y.sub(6).div(4).max(0).root(1.3).mul(fp).add(1)
                break
            case 3:
                if (y.gte(9)) x = y.sub(9).div(3).max(0).root(1.25).scaleEvery('prestige3',true,[0,fp]).add(1)
                break 
            case 4:
                if (y.gte(12)) x = y.sub(20).div(4).max(0).root(1.25).scaleEvery('prestige4',true).mul(fp).add(1)
                break 
            default:
                x = E(0)
                break;
        }
        return x.floor()
    },
    fp(i) {
        let fp = E(1)
        if (player.prestiges[2].gte(1) && i < 2) fp = fp.mul(1.15)
        if (player.prestiges[3].gte(1) && i < 3) fp = fp.mul(1.1)
        if (hasUpgrade('br',19) && i < (hasAscension(1,1) ? 4 : 3)) fp = fp.mul(upgEffect(4,19))
        return fp
    },
    unl: [
        ()=>true,
        ()=>true,
        ()=>tmp.chal14comp||tmp.inf_unl,
        ()=>tmp.brUnl||tmp.inf_unl,
        ()=>hasElement(267),
    ],
    noReset: [
        ()=>hasUpgrade('br',11)||tmp.inf_unl,
        ()=>tmp.chal13comp||tmp.inf_unl,
        ()=>tmp.chal15comp||tmp.inf_unl,
        ()=>tmp.inf_unl,
        ()=>hasElement(267),
    ],
    autoUnl: [
        ()=>tmp.chal13comp||tmp.inf_unl,
        ()=>tmp.chal14comp||tmp.inf_unl,
        ()=>tmp.chal15comp||tmp.inf_unl,
        ()=>tmp.inf_unl,
        ()=>hasElement(267),
    ],
    autoSwitch(x) { player.auto_pres[x] = !player.auto_pres[x] },
    rewards: [
        {
            "1": `使到五重质量软上限为止的所有质量软上限延迟10次方出现。`,
            "2": `使量子碎片的基础效果指数增加0.5。`,
            "3": `使量子泡沫和死寂碎片获取速度变为原来的4倍。`,
            "5": `使量子之前所有资源获取速度变为原来的2次方(在计算削弱之前生效)。`,
            "6": `使时间速度倍率的软上限延迟100次方出现。`,
            "8": `使质量获取速度的五重软上限基于转生等级而延迟出现。`,
            "10": `使相对论能量的获取速度基于转生等级而增加。`,
            "12": `使强化器效果的二重软上限弱化7.04%。`,
            "15": `使四重阶层2的奖励变得滥强。`,
            "18": `使计算转生基础值时级别的数值翻倍。`,
            "24": `使宇宙弦的超级折算弱化20%。`,
            "28": `移除胶子升级4的所有软上限。`,
            "32": `使转生基础值的指数基于转生等级而增加。`,
            "40": `使铬(24Cr)的效果略微增加。`,
            "70": `使铹(103Lr)的效果略微增加。`,
            "110": `使Ununennium(119Uue)的效果略微增加。`,
            "190": `使锆(40Zr)的效果略微增加。`,
            "218": `使Unquadpentium(145Uqp)的效果略微增加。`,
            "233": `使红色物质可以加成暗射线获取速度。`,
            "382": `使物质的指数基于转生等级的数值而增加。使坍缩星辰的效果变得滥强。`,
            "388": `使铀砹混合物的效果可以对赞颂之前(元折算之前)的转生阶层生效，只是效果倍率降低。`,
            "552": `使超新星的奇异折算延迟1.25倍出现。`,
            "607": `使色度获取速度基于转生基础值而增加。`,
            "651": `使六重阶层的究极折算延迟1.33倍出现。`,
            "867": `使锂(3Li)的效果变为指数加成。使宇宙射线的元折算延迟8次方出现。`,
            "1337": `使量子之前所有资源获取速度可以加成物质的指数，只是效果倍率降低。使转生等级382的奖励变得更好。`,
        },
        {
            "1": `使所有星辰相关资源获取速度变为原来的2次方。`,
            "2": `使超新星的元折算延迟100次出现。`,
            "3": `使玻色子的加成基于转生基础值而增加。`,
            "4": `所有原基粒子获得5级免费升级。`,
            "5": `使五重阶层5的奖励基于转生基础值变得更强。`,
            "7": `使夸克获取速度基于荣耀的数值而增加。`,
            "15": `使宇宙弦的超级折算和究极折算基于荣耀的数值而弱化。`,
            "22": `使黑暗之影获取速度变为原来的1.1次方。`,
            "33": `使铀砹混合物的效果可以对元折算之前的五重阶层需求生效，只是效果倍率降低。`,
            "46": `使挑战13-挑战15的次数上限增加500。`,
            "66": `使费米子的所有折算弱化20%。`,
            "91": `最终星辰碎片基础值变为原来的1.05次方。`,
            "127": `移除级别和阶层的所有奇异折算之前的折算，但也使挑战5的奖励和铀砹混合物对级别和阶层的第一个效果失效。`,
            "139": `每有一个最终星辰碎片，就使物质的获取速度变为原来的3倍。假真空操控器的花费略微降低。`,
            "167": `使最终星辰碎片可以加成深渊之渍的第四个效果。`,
            "247": `使μ子催化聚变阶层可以加成K介子获取速度。`,
            "300": `使元-夸克和元-轻子的软上限略微弱化。`,
            400: `使每种粒子能量的第一个效果变得更强。`,
            510: `使K介子和π介子的获取速度变为原来的1.1次方。`,
        },
        {
            "1": `使转生等级和荣耀的需求降低15%。`,
            "3": `使撕裂膨胀升级12变得更便宜。`,
            "4": `使铀砹混合物解锁新的效果。`,
            "5": `使赞颂可以加成雕文获取数量。`,
            "8": `使赞颂可以减少黑洞溢出的削弱。`,
            "22": `使赞颂可以加成所有物质获取速度。`,
            "25": `移除黑暗之前挑战的次数上限。使挑战7的奖励发生变化。`,
            "28": `使荣耀可以加成假真空操控器倍率。`,
            "34": `使π介子可以加成K介子获取速度，只是效果倍率降低。`,
            "40": `使[ct4]的效果变得更好。`,
            45: `使黑洞质量的二重溢出基于不稳定黑洞而延迟出现。`,
            58: `超-级别的最大阶层每有一重，就使奇异原子的加成效果增加5%。`,
            121: `使八重阶层1的奖励变为原来的4次方。`,
        },
        {
            "1": `之前所有转生的需求降低10%。`,
            "2": `每次名望使超新星的奇异折算延迟1.25倍出现。`,
            "4": `每次名望使腐化碎片获取数量增加50%。`,
            "6": `使奇异原子可以加成其他资源。`,
            10: `使转生等级388的奖励也对赞颂的折算生效。`,
        },
        {
            1: `使名望的超级折算弱化25%。`,
            7: `使腐化星辰升级1和升级2的花费除以1e10。`,
            12: `使八重阶层7的奖励变得滥强。`,
        },
    ],
    rewardEff: [
        {
            "8": [()=>{
                let x = player.prestiges[0].root(2).div(2).add(1)
                return x
            },x=>"延迟"+x.format()+"次方"],
            "10": [()=>{
                let x = Decimal.pow(2,player.prestiges[0])
                return x
            },x=>x.format()+"倍"],
            "32": [()=>{
                let x = player.prestiges[0].div(1e4)
                return x
            },x=>"+"+format(x)+"次方"],
            "233": [()=>{
                let x = player.dark.matters.amt[0].add(1).log10().add(1).log10().add(1).pow(2)
                return x
            },x=>""+format(x)+"倍"],
            "382": [()=>{
                let x = player.prestiges[0].max(0).root(2).div(1e3)
                if (hasPrestige(0,1337)) x = x.mul(10)
                return x
            },x=>"+"+format(x)],
            "388": [()=>{
                let x = tmp.qu.chroma_eff[1][1].root(2)
                return x
            },x=>"弱化"+formatReduction(x)+""],
            "607": [()=>{
                let x = tmp.prestiges.base.max(1).pow(1.5).softcap('e7500',0.1,0).min('e50000')
                return x
            },x=>""+format(x)+"倍"+softcapHTML(x,'e7500')],
            "1337": [()=>{
                let x = tmp.preQUGlobalSpeed.max(1).log10().add(1).log10().div(10)
                return x
            },x=>"+"+format(x)],
            /*
            "1": [()=>{
                let x = E(1)
                return x
            },x=>{
                return x.format()+"x"
            }],
            */
        },
        {
            "3": [()=>{
                let x = tmp.prestiges.base.max(1).log10().div(10).add(1).root(2)
                return x
            },x=>""+x.format()+"次方"],
            "5": [()=>{
                let x = tmp.prestiges.base.max(1).log10().div(10).add(1).root(3)
                return x
            },x=>""+x.format()+"倍"],
            "7": [()=>{
                let x = player.prestiges[1].add(1).root(3)
                return x
            },x=>""+x.format()+"次方"],
            "15": [()=>{
                let x = player.prestiges[1].root(1.5).div(10).add(1).pow(-1)
                return x
            },x=>"弱化"+formatReduction(x)+""],
            "33": [()=>{
                let x = tmp.qu.chroma_eff[1][0].max(1).log10().add(1).pow(2)
                return x
            },x=>"延迟"+x.format()+"倍"],
            "139": [()=>{
                let x = Decimal.pow(3,player.dark.matters.final)
                return x
            },x=>""+x.format(0)+"倍"],
            "247": [()=>{
                let x = Decimal.pow(player.dark.exotic_atom.tier.add(1),1.5)
                return x
            },x=>""+x.format()+"倍"],
        },
        {
            "5": [()=>{
                let x = player.prestiges[2].root(2).div(10).add(1)
                return x
            },x=>""+format(x,2)+"倍"],
            "8": [()=>{
                let x = player.prestiges[2].root(3).div(10).add(1).pow(-1)
                return x
            },x=>"弱化"+formatReduction(x)+""],
            "22": [()=>{
                let x = Decimal.pow(2,player.prestiges[2].pow(.5))
                return x
            },x=>""+format(x)+"倍"],
            "28": [()=>{
                let x = player.prestiges[1].root(2).div(10).add(1)
                return x
            },x=>""+format(x)+"倍"],
            "34": [()=>{
                let x = player.dark.exotic_atom.amount[1].add(1).log10().add(1).pow(1.5)
                return x
            },x=>""+format(x)+"倍"],
            45: [()=>{
                let y = player.bh.unstable//.overflow(1e24,0.5,0)
                let x = hasElement(224) ? Decimal.pow(1.1,y.root(4)) : y.add(1)
                if (tmp.c16active) x = overflow(x.log10().add(1).root(2),10,0.5)
                return overflow(x,1e100,0.5).min('e1750')
            },x=>"延迟"+format(x)+"次方"],
            58: [()=>{
                let x = tmp.beyond_ranks.max_tier.mul(.05)
                return x
            },x=>"+"+formatPercent(x)],
        },
        {
            "2": [()=>{
                let x = Decimal.pow(1.25,player.prestiges[3])
                return x
            },x=>"延迟"+x.format()+"倍"],
            "4": [()=>{
                let x = player.prestiges[3].div(2).add(1)
                return x
            },x=>""+x.format()+"倍"],
            "6": [()=>{
                let x = tmp.exotic_atom.amount.add(1).log10().add(1)
                return x
            },x=>""+x.format()+"倍"],
        },
        {

        },
    ],
    reset(i, bulk = false) {
        let b = this.bulk(i)
        if (i==0?tmp.prestiges.base.gte(tmp.prestiges.req[i]):player.prestiges[i-1].gte(tmp.prestiges.req[i])) if (!bulk || b.gt(player.prestiges[i]) ) {
            if (bulk) player.prestiges[i] = b
            else player.prestiges[i] = player.prestiges[i].add(1)

            if (!this.noReset[i]()) {
                for (let j = i-1; j >= 0; j--) {
                    player.prestiges[j] = E(0)
                }
                QUANTUM.enter(false,true,false,true)
            }
            
            updateRanksTemp()
        }
    },
}

const PRES_LEN = PRESTIGES.fullNames.length

function hasPrestige(x,y) { return player.prestiges[x].gte(y) && !(tmp.c16active && CORRUPTED_PRES[x] && CORRUPTED_PRES[x].includes(y)) }

function prestigeEff(x,y,def=E(1)) { return tmp.prestiges.eff[x][y] || def }

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS.names.length; x++) if (!tmp.ranks[RANKS.names[x]]) tmp.ranks[RANKS.names[x]] = {}
    let ifp = E(1)
    if (tmp.inf_unl) ifp = ifp.mul(theoremEff('mass',2))
    let fp2 = tmp.qu.chroma_eff[1][0]

    let tetr_fp2 = !hasElement(243) && hasCharger(8) ? 1 : fp2

    let rt_fp2 = !hasElement(243) && hasPrestige(1,127) ? tmp.c16active ? 5e2 : 1 : fp2
    let ffp = E(1)
    let ffp2 = 1
    if (tmp.c16active || inDarkRun()) ffp2 /= mgEff(5)

    let rooted_fp = GPEffect(3)

    let fp = RANKS.fp.rank().mul(ffp)
    tmp.ranks.rank.req = E(1.025).pow(player.ranks.rank.div(ffp2).scaleEvery('rank',false,[1,1,1,1,rt_fp2,1,ifp]).pow(rooted_fp).div(fp)).mul(1.05)
    tmp.ranks.rank.bulk = E(0)
    if (player.mass.gte(10)) tmp.ranks.rank.bulk = player.mass.div(1.05).max(1).log(1.025).mul(fp).root(rooted_fp).scaleEvery('rank',true,[1,1,1,1,rt_fp2,1,ifp]).mul(ffp2).add(1).floor();
    tmp.ranks.rank.can = player.mass.gte(tmp.ranks.rank.req) && !CHALS.inChal(5) && !CHALS.inChal(10) && !FERMIONS.onActive("03")

    fp = RANKS.fp.tier().mul(ffp)
    tmp.ranks.tier.req = player.ranks.tier.div(ifp).div(ffp2).scaleEvery('tier',false,[1,1,1,rt_fp2]).div(fp).add(2).pow(2).floor()
    tmp.ranks.tier.bulk = player.ranks.rank.max(0).root(2).sub(2).mul(fp).scaleEvery('tier',true,[1,1,1,rt_fp2]).mul(ffp2).mul(ifp).add(1).floor();

    fp = E(1).mul(ffp)
    let pow = 2
    if (hasElement(44)) pow = 1.75
    if (hasElement(9)) fp = fp.mul(1/0.85)
    if (player.ranks.pent.gte(1)) fp = fp.mul(1/0.85)
    if (hasElement(72)) fp = fp.mul(1/0.85)

    let tps = 0

    tmp.ranks.tetr.req = player.ranks.tetr.div(ifp).div(ffp2).scaleEvery('tetr',false,[1,1,1,tetr_fp2]).div(fp).pow(pow).mul(3).add(10-tps).floor()
    tmp.ranks.tetr.bulk = player.ranks.tier.sub(10-tps).div(3).max(0).root(pow).mul(fp).scaleEvery('tetr',true,[1,1,1,tetr_fp2]).mul(ffp2).mul(ifp).add(1).floor();

    fp = E(1).mul(ffp)
    let fpa = hasPrestige(1,33) ? [1,1,1,prestigeEff(1,33,1)] : []
    if (player.ranks.hex.gte(1)) fp = fp.div(0.8)
    pow = 1.5
    tmp.ranks.pent.req = player.ranks.pent.div(ifp).div(ffp2).scaleEvery('pent',false,fpa).div(fp).pow(pow).add(15-tps).floor()
    tmp.ranks.pent.bulk = player.ranks.tetr.sub(15-tps).gte(0)?player.ranks.tetr.sub(15-tps).max(0).root(pow).mul(fp).scaleEvery('pent',true,fpa).mul(ffp2).mul(ifp).add(1).floor():E(0);

    fp = E(1)
    pow = 1.8
    let s = 20
    if (hasElement(167)) {
        s /= 2
        pow *= 0.9
    }
    tmp.ranks.hex.req = player.ranks.hex.div(ifp).div(ffp2).div(fp).scaleEvery('hex',false).pow(pow).add(s-tps).floor()
    tmp.ranks.hex.bulk = player.ranks.pent.sub(s-tps).gte(0)?player.ranks.pent.sub(s-tps).max(0).root(pow).scaleEvery('hex',true).mul(fp).mul(ffp2).mul(ifp).add(1).floor():E(0);

    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (x > 0) {
            tmp.ranks[rn].can = player.ranks[RANKS.names[x-1]].gte(tmp.ranks[rn].req)
        }
    }

    // Prestige

    tmp.prestiges.baseMul = PRESTIGES.base()
    tmp.prestiges.baseExp = PRESTIGES.baseExponent()
    tmp.prestiges.base = tmp.prestiges.baseMul.pow(tmp.prestiges.baseExp)
    for (let x = 0; x < PRES_LEN; x++) {
        tmp.prestiges.req[x] = PRESTIGES.req(x)
        for (let y in PRESTIGES.rewardEff[x]) {
            if (PRESTIGES.rewardEff[x][y]) tmp.prestiges.eff[x][y] = PRESTIGES.rewardEff[x][y][0]()
        }
    }

    // Ascension

    updateAscensionsTemp()

    // Beyond

    let p = 1

    if (hasElement(221)) p /= 0.95
    p /= getFragmentEffect('time')

    tmp.beyond_ranks.tier_power = p

    let rcs = E(1e14)

    if (hasUpgrade('rp',22)) rcs = rcs.mul(upgEffect(1,22))
    if (hasElement(287)) rcs = rcs.mul(elemEffect(287))

    tmp.rank_collapse.start = rcs

    tmp.beyond_ranks.scale_start = 24
    tmp.beyond_ranks.scale_pow = 1.6

    tmp.beyond_ranks.max_tier = BEYOND_RANKS.getTier()
    tmp.beyond_ranks.latestRank = BEYOND_RANKS.getRankFromTier(tmp.beyond_ranks.max_tier)

    tmp.beyond_ranks.req = BEYOND_RANKS.req()
    tmp.beyond_ranks.bulk = BEYOND_RANKS.bulk()

    for (let x in BEYOND_RANKS.rewardEff) {
        for (let y in BEYOND_RANKS.rewardEff[x]) {
            if (BEYOND_RANKS.rewardEff[x][y]) tmp.beyond_ranks.eff[x][y] = BEYOND_RANKS.rewardEff[x][y][0]()
        }
    }
}

const BEYOND_RANKS = {
    req() {
        let p = player.ranks.beyond, rc = tmp.rank_collapse

        let x = p.scale(rc.start,rc.power,2).pow(1.25).mul(10).add(180)

        rc.reduction = p.gte(rc.start) ? x.log(p.pow(1.25).mul(10).add(180)) : E(1)

        return x.ceil()
    },
    bulk() {
        let rc = tmp.rank_collapse

        let x = player.ranks.hex.gte(180)?player.ranks.hex.sub(180).div(10).max(0).root(1.25).scale(rc.start,rc.power,2,true).add(1).floor():E(0)

        return x
    },
    getTier(r=player.ranks.beyond) {
        let x = r.gt(0)?r.log10().max(0).pow(.8).mul(tmp.beyond_ranks.tier_power).add(1).scale(tmp.beyond_ranks.scale_start,tmp.beyond_ranks.scale_pow,0,true).floor():E(1)
        return x
    },
    getRankFromTier(i,r=player.ranks.beyond) {
        let hp = Decimal.pow(10,Decimal.pow(Decimal.sub(i.scale(tmp.beyond_ranks.scale_start,tmp.beyond_ranks.scale_pow,0),1).div(tmp.beyond_ranks.tier_power),1/.8)).ceil()

        return r.div(hp).floor()
    },
    getRequirementFromTier(i,t=tmp.beyond_ranks.latestRank,mt=tmp.beyond_ranks.max_tier) {
        let s = tmp.beyond_ranks.scale_start, p = tmp.beyond_ranks.scale_pow
        return Decimal.pow(10,Decimal.pow(Decimal.div(mt.add(1).scale(s,p,0).sub(1),tmp.beyond_ranks.tier_power),1/.8).sub(Decimal.pow(Decimal.sub(mt,i).add(1).scale(s,p,0).sub(1).div(tmp.beyond_ranks.tier_power),1/.8))).mul(Decimal.add(t,1)).ceil()
        // Decimal.pow(10,Math.pow(mt/tmp.beyond_ranks.tier_power,1/.8)-Math.pow((mt-i)/tmp.beyond_ranks.tier_power,1/.8)).mul(Decimal.add(t,1)).ceil()
    },
    getRankDisplayFromValue(r) {
        let tier = this.getTier(r), current = this.getRankFromTier(tier,r);

        return getRankTierName(tier.add(5)) + current.format(0)
    },

    reset(auto=false) {
        if (player.ranks.hex.gte(tmp.beyond_ranks.req) && (!auto || tmp.beyond_ranks.bulk.gt(player.ranks.beyond))) {
            player.ranks.beyond = auto ? player.ranks.beyond.max(tmp.beyond_ranks.bulk) : player.ranks.beyond.add(1)

            if (hasBeyondRank(2,2)||hasInfUpgrade(10)) return;

            player.ranks.hex = E(0)
            DARK.doReset()
        }
    },

    rewards: {
        1: {
            1: `使物质的指数增加0.5。`,
            2: `使所有物质的升级基于暗射线的数值变得更强。`,
            4: `使铀砹混合物的第二个效果基于最终星辰碎片的数值变得更强。`,
            7: `使物质的获取速度基于七重阶层(超-级别)的数值而增加。`,
        },
        2: {
            1: `您可以自动购买超-级别。超-级别可以对转生基础值生效。`,
            2: `超-级别不再重置任何东西。使[元-轻子]的效果变为原来的8倍。`,
            4: `加速器效果可以对时间速度、黑洞压缩器和宇宙射线倍率生效。使色度获取速度变为原来的1.1次方。`,
            7: `使元-费米子以外的费米子获取速度基于七重阶层的数值而增加。`,
            10: `使黑洞质量变为原来的1.2次方。`,
            15: `移除质量升级1-质量升级3的所有折算。`,
            17: `使[qu9]的效果基于黑洞质量的数值变得更好。超新星的奇异折算基于前往量子的次数而延迟出现。`,
            20: `使挑战1的奖励发生变化。`,
        },
        3: {
            1: `质量和强化器的溢出基于质量的宇宙阶层而弱化。`,
            2: `使最终星辰碎片的超级折算延迟1次出现。`,
            4: `使超-级别可以加成π介子和K介子的获取速度。`,
            12: `移除暗射线第四个效果的软上限。`,
            18: `超-级别的最大阶层每有一重，就使最终星辰碎片的超级折算弱化2.5%(最高弱化50%)。`,
            32: `使氩(18Ar)的效果可以对时间速度倍率生效。`,
        },
        4: {
            1: `使超新星的超临界折算基于贝塔[B]粒子而延迟出现，只是效果倍率降低。`,
            2: `超-级别的最大阶层从十重阶层开始，每有一重，就使转生基础值的指数增加一次。`,
            40: `使[陶子]的效果变为原来的立方。`,
        },
        5: {
            2: `超-级别的最大阶层从十重阶层开始，每有一重，就使最终星辰碎片的超级折算延迟1次出现。`,
            7: `移除转生等级所有元折算之前的折算。`,
        },
        6: {
            1: `“自助无限”和“奇异速度”升级的公式中，底数由2变为3。`,
            12: `使Bitriunium(231Btu)的效果变为原来的立方。`,
        },
        8: {
            1: `超-级别的最大阶层每有一重，就使无限点数获取速度翻倍。`,
        },
        11: {
            1: `移除荣耀和赞颂的所有折算。`,
        },
        12: {
            1: `使零号中子的效果对挑战16也生效，只是效果倍率极度降低。`,
        },
        14: {
            1: `使十重阶层2的公式变得更好。超-级别的最大阶层从二十重阶层开始，每有一重，就使转生等级的元折算延迟更多出现。`,
        },
        16: {
            1: `超-级别的最大阶层从二十重阶层开始，每有一重，就使飞升基础值增加更多。`,
        },
        20: {
            1: `使加速器效果的第二重软上限略微弱化。`,
        },
        28: {
            1: `无限定理的超级折算延迟5次出现。`,
        },
    },

    rewardEff: {
        1: {
            2: [
                ()=>{
                    let x = player.dark.rays.add(1).log10().root(2).softcap(10,0.25,0).div(100).add(1)

                    return x
                },
                x=>"增加"+formatPercent(x-1)+""+softcapHTML(x,1.1),
            ],
            4: [
                ()=>{
                    let x = player.dark.matters.final.pow(.75).div(10).add(1)

                    return x
                },
                x=>"增加"+formatPercent(x-1)+"",
            ],
            7: [
                ()=>{
                    let x = player.ranks.beyond.add(1).root(2)

                    return x
                },
                x=>"^"+format(x),
            ],
        },
        2: {
            1: [
                ()=>{
                    let x = player.ranks.beyond.pow(3)

                    if (hasPrestige(2,121)) x = x.pow(4)

                    return x.add(1)
                },
                x=>""+format(x)+"倍",
            ],
            7: [
                ()=>{
                    let x = hasPrestige(4,12) ? player.ranks.beyond.add(1).pow(0.4) : player.ranks.beyond.add(1).log10().add(1).pow(2).overflow(10,0.5)

                    return x
                },
                x=>""+format(x)+"倍",
            ],
            17: [
                ()=>{
                    let x = player.bh.mass.add(1).log10().add(1).log10().add(1).pow(2)
                    
                    let y = player.qu.times.add(1).log10().root(2).div(8).add(1)

                    return [x,y]
                },
                x=>""+format(x[0])+"倍；延迟"+format(x[1])+"倍",
            ],
        },
        3: {
            1: [
                ()=>{
                    let x = Decimal.pow(0.99,player.mass.div(1.5e56).max(1).log10().div(1e9).max(1).log10().div(15).root(3))

                    return x
                },
                x=>"弱化"+formatReduction(x)+"",
            ],
            4: [
                ()=>{
                    let x = player.ranks.beyond.add(1).log10().add(1).pow(2)

                    return x
                },
                x=>""+format(x)+"倍",
            ],
            18: [
                ()=>{
                    let x = Decimal.sub(1,tmp.beyond_ranks.max_tier.mul(0.025))

                    return Decimal.max(0.5,x)
                },
                x=>"弱化"+formatReduction(x)+"",
            ],
        },
        4: {
            1: [
                ()=>{
                    let x = overflow(tmp.prim.eff[7].div(5),1e6,0.5).softcap(1e7,1/3,0)

                    return x
                },
                x=>"延迟"+format(x)+"",
            ],
            2: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier.sub(3).pow(hasBeyondRank(14,1) ? 1 : .2).mul(.2).add(1) // (tmp.beyond_ranks.max_tier-3)**0.2*0.2+1

                    return Decimal.max(1,x)
                },
                x=>""+format(x)+"倍",
            ],
        },
        5: {
            2: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier.sub(1)

                    return Decimal.max(1,x)
                },
                x=>"延迟"+format(x,0)+"次",
            ],
        },
        8: {
            1: [
                ()=>{
                    let x = Decimal.pow(2,tmp.beyond_ranks.max_tier)

                    return x
                },
                x=>formatMult(x),
            ],
        },
        12: {
            1: [
                ()=>{
                    let x = tmp.qu.chroma_eff[2].max(1).log10().add(1).root(3)

                    return x
                },
                x=>formatMult(x),
            ],
        },
        14: {
            1: [
                ()=>{
                    let x = Decimal.pow(1.25,tmp.beyond_ranks.max_tier.sub(13).max(0).root(2))

                    return x
                },
                x=>"延迟"+format(x)+"倍",
            ],
        },
        16: {
            1: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier.sub(13).max(0).div(50)

                    return x
                },
                x=>"+"+format(x),
            ],
        },
    },
}

const RTNS = [
    ['','级别','阶层','四重阶层','五重阶层','六重阶层','七重阶层','八重阶层','九重阶层'],
]

const RTNS2 = [
    ['','一','二','三','四','五','六','七','八','九'],
]

function getRankTierName(i) {
    if (Decimal.gte(i,999)) return '['+format(i,0,9,'sc')+']'
    else {
        i = Number(i)

        if (i < 9) return RTNS[0][i]
        i += 1
        let m = ''
        let h = Math.floor(i / 100), d = Math.floor(i / 10) % 10, o = i % 10

        if (h > 0 && d == 0) m += RTNS2[0][h] + '百零'
        else if (h > 0) m += RTNS2[0][h] + '百'
        if (d > 1) m += RTNS2[0][d] + '十'
        else m += '十'
        m += RTNS2[0][o] + '重阶层'

        return capitalFirst(m)
    }
}

function hasBeyondRank(x,y) {
    let t = tmp.beyond_ranks.max_tier, lt = tmp.beyond_ranks.latestRank||E(0)
    return t.gt(x) || t.eq(x) && lt.gte(y)
}

function beyondRankEffect(x,y,def=1) {
    let e = tmp.beyond_ranks.eff[x]
    return e?e[y]||def:def
}

function updateRanksHTML() {
    tmp.el.rank_tabs.setDisplay(hasUpgrade('br',9))
    tmp.el.asc_btn.setDisplay(tmp.ascensions_unl)
    for (let x = 0; x < 3; x++) {
        tmp.el["rank_tab"+x].setDisplay(tmp.rank_tab == x)
    }

    if (tmp.rank_tab == 0) {
        for (let x = 0; x < RANKS.names.length; x++) {
            let rn = RANKS.names[x]
            let unl = (!tmp.brUnl || x > 3)&&(RANKS.unl[rn]?RANKS.unl[rn]():true)
            tmp.el["ranks_div_"+x].setDisplay(unl)
            if (unl) {
                let keys = Object.keys(RANKS.desc[rn])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (player.ranks[rn].lt(keys[i])) {
                        desc = `${RANKS.fullNames[x]}${format(keys[i],0)}时，${RANKS.desc[rn][keys[i]]}`
                        break
                    }
                }
    
                tmp.el["ranks_scale_"+x].setTxt(getScalingName(rn))
                tmp.el["ranks_amt_"+x].setTxt(format(player.ranks[rn],0))
                tmp.el["ranks_"+x].setClasses({btn: true, reset: true, locked: !tmp.ranks[rn].can})
                tmp.el["ranks_desc_"+x].setTxt(desc)
                tmp.el["ranks_req_"+x].setTxt(x==0?formatMass(tmp.ranks[rn].req):RANKS.fullNames[x-1]+format(tmp.ranks[rn].req,0))
                tmp.el["ranks_auto_"+x].setDisplay(RANKS.autoUnl[rn]())
                tmp.el["ranks_auto_"+x].setTxt(player.auto_ranks[rn]?"ON":"OFF")
            }
        }

        let unl = tmp.brUnl

        tmp.el.pre_beyond_ranks.setDisplay(unl)
        tmp.el.beyond_ranks.setDisplay(unl)
        if (unl) {
            let h = ''
            for (let x = 0; x < 4; x++) {
                let rn = RANKS.names[x]
                h += '<div>' + getScalingName(rn) + '<i></i>' + RANKS.fullNames[x] + '<h4>' + format(player.ranks[rn],0) + '</h4></div>'
            }
            tmp.el.pre_beyond_ranks.setHTML(h)

            // Beyond Rank

            tmp.el.br_auto.setDisplay(hasBeyondRank(2,1)||hasInfUpgrade(10))
            tmp.el.br_auto.setTxt(player.auto_ranks.beyond?"ON":"OFF")

            let t = tmp.beyond_ranks.max_tier
            h = ''

            for (let x = Math.min(3,t.toNumber())-1; x >= 0; x--) {
                h += getRankTierName(t.add(5).sub(x)) + "<h4>" + (x == 0 ? tmp.beyond_ranks.latestRank.format(0) : BEYOND_RANKS.getRankFromTier(t.sub(x)).format(0)) + '</h4>' + (x>0?'<br>':"")
            }

            tmp.el.br_amt.setHTML(h)

            let r = '', b = false

            for (tt in BEYOND_RANKS.rewards) {
                b = false
                for (tr in BEYOND_RANKS.rewards[tt]) {
                    tt = Number(tt)
                    if (t.lt(tt) || (tmp.beyond_ranks.latestRank.lt(tr) && t.eq(tt))) {
                        r = ""+getRankTierName(tt+5)+""+format(tr,0)+"时，"+BEYOND_RANKS.rewards[tt][tr]
                        b = true
                        break
                    }
                }
                if (b) break;
            }

            h = `
                重置六重阶层(并强制融入黑暗)，但提升当前级别。${r}<br>
                要提升${getRankTierName(t.add(5))}，需要${getRankTierName(t.add(4))}${
                    t == 1
                    ? tmp.beyond_ranks.req.format(0)
                    : BEYOND_RANKS.getRequirementFromTier(1,tmp.beyond_ranks.latestRank,t.sub(1)).format(0)
                }。<br>
                要提升${getRankTierName(t.add(6))}，需要${getRankTierName(t.add(5))}${BEYOND_RANKS.getRequirementFromTier(1,0).format(0)}。
            `

            tmp.el.br_desc.setHTML(h)
            tmp.el.br_desc.setClasses({btn: true, reset: true, locked: player.ranks.hex.lt(tmp.beyond_ranks.req)})
        }

        let rc = tmp.rank_collapse

        tmp.el.rankCollapse.setDisplay(player.ranks.beyond.gte(rc.start))
        tmp.el.rankCollapse.setHTML(`Because of Rank Collapse at <b>${BEYOND_RANKS.getRankDisplayFromValue(rc.start)}</b>, Hept's requirement is raised by <b>${rc.reduction.format()}</b>!`)
    }
    else if (tmp.rank_tab == 1) {
        tmp.el.pres_base.setHTML(`${tmp.prestiges.baseMul.format(0)}<sup>${format(tmp.prestiges.baseExp)}</sup> = ${tmp.prestiges.base.format(0)}`)

        for (let x = 0; x < PRES_LEN; x++) {
            let unl = PRESTIGES.unl[x]?PRESTIGES.unl[x]():true

            tmp.el["pres_div_"+x].setDisplay(unl)

            if (unl) {
                let p = player.prestiges[x] || E(0)
                let keys = Object.keys(PRESTIGES.rewards[x])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (p.lt(keys[i]) && (tmp.chal13comp || p.lte(PRES_BEFOREC13[x]||Infinity))) {
                        desc = `${PRESTIGES.fullNames[x]}${format(keys[i],0)}时，${PRESTIGES.rewards[x][keys[i]]}`
                        break
                    }
                }

                tmp.el["pres_scale_"+x].setTxt(getScalingName("prestige"+x))
                tmp.el["pres_amt_"+x].setTxt(format(p,0))
                tmp.el["pres_"+x].setClasses({btn: true, reset: true, locked: x==0?tmp.prestiges.base.lt(tmp.prestiges.req[x]):player.prestiges[x-1].lt(tmp.prestiges.req[x])})
                tmp.el["pres_desc_"+x].setTxt(desc)
                tmp.el["pres_req_"+x].setTxt(x==0?format(tmp.prestiges.req[x],0)+"转生基础值":PRESTIGES.fullNames[x-1]+format(tmp.prestiges.req[x],0))
                tmp.el["pres_auto_"+x].setDisplay(PRESTIGES.autoUnl[x]())
                tmp.el["pres_auto_"+x].setTxt(player.auto_pres[x]?"ON":"OFF")
            }
        }

        updateGPHTML()
    }
    else if (tmp.rank_tab == 2) {
        updateAscensionsHTML()
    }
}

const PRES_BEFOREC13 = [40,7]

const GAL_PRESTIGE = {
    req() {
        let x = Decimal.pow(10,player.gal_prestige.scaleEvery('gal_prestige').pow(1.5)).mul(1e17)

        return x
    },
    reset() {
        if (player.supernova.times.gte(tmp.gp.req)) {
            player.gal_prestige = player.gal_prestige.add(1)

            INF.doReset()
        }
    },
    gain(i) {
        let x = E(0), gp = player.gal_prestige

        switch (i) {
            case 0:
                if (gp.gte(1)) {
                    x = player.stars.points.add(1).log10().add(1).log10().add(1).pow(gp.root(1.5)).sub(1)
                }
            break;
            case 1:
                if (gp.gte(2)) {
                    x = tmp.prestiges.base.add(1).log10().add(1).pow(gp.sub(1).root(1.5)).sub(1)
                }
            break;
            case 2:
                if (gp.gte(4)) {
                    x = player.dark.matters.amt[12].add(1).log10().add(1).log10().add(1).pow(2).pow(gp.sub(3).root(1.5)).sub(1)
                }
            break;
            case 3:
                if (gp.gte(6)) {
                    x = player.supernova.radiation.hz.add(1).log10().add(1).log10().add(1).pow(2).pow(gp.sub(5).root(1.5)).sub(1)
                }
            break;
            case 4:
                if (gp.gte(9)) {
                    x = player.inf.cs_amount.add(1).log10().add(1).pow(2).pow(gp.sub(8).root(1.5)).sub(1)
                }
            break;
            case 5:
                if (gp.gte(14)) {
                    x = player.supernova.bosons.hb.add(10).log10().log10().add(1).pow(gp.sub(13).root(1.5)).sub(1)
                }
            break;
        }

        if (hasElement(263)) x = x.mul(elemEffect(263))
        if (hasElement(281)) x = x.mul(elemEffect(281))

        return x
    },
    effect(i) {
        let x, res = player.gp_resources[i]

        switch (i) {
            case 0:
                x = res.add(1).log10().root(2).div(20).add(1)
            break;
            case 1:
                x = Decimal.pow(0.97,res.add(1).log10().overflow(10,0.5).root(2))
            break;
            case 2:
                x = res.add(1).log10().root(3).div(2)
            break;
            case 3:
                x = Decimal.pow(0.9,res.add(10).log10().log10().add(1).pow(2).sub(1))
            break;
            case 4:
                x = Decimal.pow(0.95,res.add(1).slog(10))
            break;
            case 5:
                x = expMult(res.add(1),0.5)
            break;
        }

        return x
    },
    res_length: 6,
}

function GPEffect(i,def=1) { return tmp.gp.res_effect[i]||def }

function updateGPTemp() {
    tmp.gp.req = GAL_PRESTIGE.req()

    for (let i = 0; i < GAL_PRESTIGE.res_length; i++) {
        tmp.gp.res_gain[i] = GAL_PRESTIGE.gain(i)
        tmp.gp.res_effect[i] = GAL_PRESTIGE.effect(i)
    }
}

function updateGPHTML() {
    let unl = hasElement(262)

    tmp.el.galactic_prestige_div.setDisplay(unl)

    if (unl) {
        let gp = player.gal_prestige

        tmp.el.gal_prestige.setHTML(gp.format(0))
        tmp.el.gal_prestige_scale.setHTML(getScalingName('gal_prestige'))
        tmp.el.gp_btn.setHTML(`
        Reset Supernovas (force an Infinity reset), but Galactic Prestige up. Next Galactic Prestige reveals its treasure or happens nothing.<br><br>
        Require: <b>${tmp.gp.req.format()}</b> Supernovas
        `)
        tmp.el.gp_btn.setClasses({btn: true, galactic: true, locked: player.supernova.times.lt(tmp.gp.req)})

        let h = '', res = player.gp_resources, res_gain = tmp.gp.res_gain, res_effect = tmp.gp.res_effect

        if (gp.gte(1)) h += `You have <h4>${res[0].format(0)}</h4>${res[0].formatGain(res_gain[0])}银河星辰(基于坍缩星辰和银河转生的数值而定)，它使星辰发生器的指数增加<h4>${formatPercent(res_effect[0].sub(1))}</h4> exponentially.<br>`

        if (gp.gte(2)) h += `You have <h4>${formatMass(res[1])}</h4>${res[1].formatGain(res_gain[1],true)}转生质量(基于转生基础值和银河转生的数值而定)，它使质量的溢出和二重溢出弱化<h4>${formatReduction(res_effect[1])}</h4>.<br>`

        if (gp.gte(4)) h += `You have <h4>${res[2].format(0)}</h4>${res[2].formatGain(res_gain[2])}银河质量(基于褪色物质和银河转生的数值而定)，它使所有物质升级的基础值增加<h4>${format(res_effect[2])}</h4>.<br>`

        if (gp.gte(6)) h += `You have <h4>${res[3].format(0)}</h4>${res[3].formatGain(res_gain[3])}红移值(基于频率和银河转生的数值而定)，它使级别的需求减少为<h4>${format(res_effect[3],5)}次方</h4>.<br>`

        if (gp.gte(9)) h += `You have <h4>${res[4].format(0)}</h4>${res[4].formatGain(res_gain[4])}正常能量(基于腐化星辰和银河转生的数值而定)，它使腐化星辰速度的降低弱化<h4>${formatReduction(res_effect[4])}</h4>.<br>`

        if (gp.gte(14)) h += `You have <h4>${res[5].format(0)}</h4>${res[5].formatGain(res_gain[5])}胀子(基于希格斯玻色子和银河转生的数值而定)，它使无限之前所有资源获取速度变为原来的<h4>${format(res_effect[5])}</h4>倍。<br>`

        tmp.el.gp_rewards.setHTML(h)
    }
}
